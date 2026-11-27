import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickBookingBar, QuickBookingPreset } from './components/QuickBookingBar';
import { ServicesSection, AirportTransferSelection } from './components/ServicesSection';
import { DailyRentalSection } from './components/DailyRentalSection';
import { WhyAlWakeelSection } from './components/WhyAlWakeelSection';
import { FleetSection } from './components/FleetSection';
import type { BookingFlowMode } from './components/BookingModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const LazyCustomerBookings = React.lazy(() =>
  import('./components/CustomerBookings').then((mod) => ({ default: mod.CustomerBookings }))
);
const LazyAdminDashboard = React.lazy(() =>
  import('./components/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard }))
);
import { Footer } from './components/Footer';
import { DestinationsSection } from './components/DestinationsSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection } from './components/FAQSection';
import { WhatsAppFab } from './components/WhatsAppFab';
import { Service, Vehicle, PricingRule, ServiceCategoryKey } from './types';
import { initialServices, initialVehicles, initialPricingRules } from './data/mockData';
import { extractStructuredRouteRules, DailyRentalPackageId } from './lib/bookingEngine';
import {
  ServiceCategorySlug,
  parseServiceSlugFromLocation,
  getServiceCategoryPath,
} from './data/seoCatalog';
import { syncPageSeoAndSchema } from './lib/seoAndShare';


const LazyServiceCategoryPage = React.lazy(() =>
  import('./components/ServiceCategoryPage').then((mod) => ({
    default: mod.ServiceCategoryPage,
  }))
);

const LazyBookingModal = React.lazy(() =>
  import('./components/BookingModal').then((mod) => ({
    default: mod.BookingModal,
  }))
);

const CATALOG_CACHE_KEY = 'alwakeel_catalog_cache_v3';
const CACHE_TTL_MS = 15 * 60 * 1000;

interface CatalogCache {
  services: Service[];
  vehicles: Vehicle[];
  pricingRules: PricingRule[];
  timestamp: number;
}

function readCatalogCache(): CatalogCache | null {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CatalogCache;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    if (!parsed.services?.length || !parsed.pricingRules?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCatalogCache(services: Service[], vehicles: Vehicle[], pricingRules: PricingRule[]) {
  try {
    const payload: CatalogCache = {
      services,
      vehicles,
      pricingRules,
      timestamp: Date.now(),
    };
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCategorySlug, setActiveCategorySlug] = useState<ServiceCategorySlug | null>(() => {
    if (typeof window === 'undefined') return null;
    return parseServiceSlugFromLocation(
      window.location.pathname,
      window.location.search,
      window.location.hash
    );
  });
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [hasMountedBooking, setHasMountedBooking] = useState(false);

  const [bookingMode, setBookingMode] = useState<BookingFlowMode>('transfer');
  const [preselectedDailyPackageId, setPreselectedDailyPackageId] = useState<DailyRentalPackageId | null>(null);

  const [preselectedOrigin, setPreselectedOrigin] = useState<string | null>(null);
  const [preselectedDestination, setPreselectedDestination] = useState<string | null>(null);
  const [preselectedDate, setPreselectedDate] = useState<string | null>(null);
  const [preselectedTime, setPreselectedTime] = useState<string | null>(null);
  const [preselectedPassengers, setPreselectedPassengers] = useState<number | null>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<ServiceCategoryKey | null>(null);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);
  const [bookingOpenedFromQuickBar, setBookingOpenedFromQuickBar] = useState<boolean>(false);
  const [bookingOpenNonce, setBookingOpenNonce] = useState<number>(0);
  const [pendingEditReturnStep, setPendingEditReturnStep] = useState<1 | 2 | 3 | null>(null);

  const cached = readCatalogCache();
  const [services, setServices] = useState<Service[]>(cached?.services || initialServices);
  const [vehicles, setVehicles] = useState<Vehicle[]>(cached?.vehicles || initialVehicles);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(
    extractStructuredRouteRules(cached?.pricingRules || initialPricingRules)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const slug = parseServiceSlugFromLocation(
        window.location.pathname,
        window.location.search,
        window.location.hash
      );
      setActiveCategorySlug(slug);
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    syncPageSeoAndSchema(activeTab === 'home' ? activeCategorySlug : null);
  }, [activeTab, activeCategorySlug]);

  useEffect(() => {
    if (isBookingOpen) setHasMountedBooking(true);
  }, [isBookingOpen]);

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      if (readCatalogCache()) {
        return;
      }
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
      }

      try {
        const {
          db,
          collection,
          getDocs,
          testConnection,
          isOfflineOrNetworkError,
        } = await import('./lib/firebase');
        const connected = await testConnection();
        if (!connected || cancelled) return;

        const [servicesSnapshot, vehiclesSnapshot, rulesSnapshot] = await Promise.all([
          getDocs(collection(db, 'services')),
          getDocs(collection(db, 'vehicles')),
          getDocs(collection(db, 'pricingRules')),
        ]);

        if (cancelled) return;

        let nextServices = initialServices;
        if (servicesSnapshot.empty) {
          // Public catalog loading is read-only; seed data remains local until an
          // authenticated administrative setup process writes it.
          nextServices = initialServices;
        } else {
          const loaded: Service[] = [];
          servicesSnapshot.forEach((d) => loaded.push(d.data() as Service));
          if (loaded.length > 0) {
            nextServices = initialServices.map((def) => {
              const existing = loaded.find((l) => l.id === def.id);
              return existing
                ? {
                    ...existing,
                    basePrice: def.basePrice,
                    titleAr: def.titleAr,
                    titleEn: def.titleEn,
                    descriptionAr: def.descriptionAr,
                  }
                : def;
            });
          }
        }

        let nextVehicles = initialVehicles;
        if (vehiclesSnapshot.empty) {
          nextVehicles = initialVehicles;
        } else {
          const loaded: Vehicle[] = [];
          vehiclesSnapshot.forEach((d) => loaded.push(d.data() as Vehicle));
          if (loaded.length > 0) nextVehicles = loaded;
        }

        let nextRules = initialPricingRules;
        const loadedRules: PricingRule[] = [];
        rulesSnapshot.forEach((d) => loadedRules.push(d.data() as PricingRule));
        const structuredLoaded = loadedRules.filter((r) => Boolean(r.origin && r.destination));

        if (structuredLoaded.length === 0) {
          nextRules = initialPricingRules;
        } else {
          nextRules = structuredLoaded;
        }

        if (!cancelled) {
          setServices(nextServices);
          setVehicles(nextVehicles);
          setPricingRules(nextRules);
          writeCatalogCache(nextServices, nextVehicles, nextRules);
        }
      } catch (error) {
        if (isOfflineOrNetworkError(error)) {
          console.warn('Operating with cached/local catalog data because Firestore is unreachable.');
        } else {
          console.warn('Fallback to local catalog data:', error);
        }
      }
    };

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenCategoryPage = (slug: ServiceCategorySlug) => {
    setActiveTab('home');
    setActiveCategorySlug(slug);
    if (typeof window !== 'undefined') {
      const targetPath = getServiceCategoryPath(slug);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ categorySlug: slug }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = () => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin(null);
    setPreselectedDestination(null);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(null);
    setPreselectedCategory(null);
    setPreselectedService(null);
    setBookingOpenedFromQuickBar(false);
    setPendingEditReturnStep(null);
    setBookingOpenNonce((n) => n + 1);
    setIsBookingOpen(true);
  };

  const handleOpenAirportTransfer = (selection: AirportTransferSelection) => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin(selection.origin);
    setPreselectedDestination(selection.destination);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(null);
    setPreselectedCategory(selection.category);
    setPreselectedService(null);
    setBookingOpenedFromQuickBar(false);
    setPendingEditReturnStep(null);
    setBookingOpenNonce((n) => n + 1);
    setIsBookingOpen(true);
  };

  const handleOpenDailyRental = (packageId: DailyRentalPackageId) => {
    setBookingMode('daily_rental');
    setPreselectedDailyPackageId(packageId);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedService(null);
    setBookingOpenedFromQuickBar(false);
    setPendingEditReturnStep(null);
    setBookingOpenNonce((n) => n + 1);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithDestination = (origin: string, destination: string) => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin(origin);
    setPreselectedDestination(destination);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(null);
    setPreselectedCategory(null);
    setPreselectedService(null);
    setBookingOpenedFromQuickBar(false);
    setPendingEditReturnStep(null);
    setBookingOpenNonce((n) => n + 1);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithCategory = (
    category: ServiceCategoryKey | null,
    presetRoute?: { origin: string; destination: string }
  ) => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin(presetRoute ? presetRoute.origin : null);
    setPreselectedDestination(presetRoute ? presetRoute.destination : null);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(null);
    setPreselectedCategory(category);
    setPreselectedService(null);
    setBookingOpenedFromQuickBar(false);
    setPendingEditReturnStep(null);
    setBookingOpenNonce((n) => n + 1);
    setIsBookingOpen(true);
  };

  const handleQuickBooking = (preset: QuickBookingPreset) => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin(preset.origin || 'الإسكندرية');
    setPreselectedDestination(preset.destination || 'مطار برج العرب الدولي');
    setPreselectedDate(preset.travelDate || null);
    setPreselectedTime(preset.travelTime || null);
    setPreselectedPassengers(preset.passengersCount || 2);
    setPreselectedCategory(preset.serviceCategory || null);
    setPreselectedService(preset.service || null);
    setBookingOpenedFromQuickBar(true);
    setBookingOpenNonce((n) => n + 1);
    setIsBookingOpen(true);
  };

  const handleEditPassengersInQuickBar = (fromStep: 2 | 3) => {
    setIsBookingOpen(false);
    setPendingEditReturnStep(fromStep);
    setActiveCategorySlug(null);
    setActiveTab('home');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setTimeout(() => {
      const bar = document.getElementById('quick-booking-bar');
      if (bar) {
        bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const selectEl = document.getElementById('qb-passengers') as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.focus();
      }
    }, 80);
  };

  const handlePricingRulesUpdated = (updated: PricingRule[]) => {
    setPricingRules(updated);
    writeCatalogCache(services, vehicles, updated);
  };

  const handleNavigateSection = (
    target:
      | 'home'
      | 'services'
      | 'daily-rental'
      | 'fleet'
      | 'why-al-wakeel'
      | 'faq'
      | 'contact'
      | 'contact-footer'
      | 'my-bookings'
      | 'admin'
  ) => {
    if (target === 'my-bookings' || target === 'admin') {
      setActiveCategorySlug(null);
      setActiveTab(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const wasDifferentView = activeTab !== 'home' || activeCategorySlug !== null;
    setActiveCategorySlug(null);
    setActiveTab('home');

    if (typeof window !== 'undefined' && (window.location.pathname !== '/' || window.location.search)) {
      window.history.pushState({}, '', '/');
    }

    const scrollTarget = () => {
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (wasDifferentView) {
      setTimeout(scrollTarget, 70);
    } else {
      scrollTarget();
    }
  };

  return (
    <div className="min-h-screen bg-[#101D2D] text-[#F6F5F1] selection:bg-[#C9A96B] selection:text-[#101D2D]" dir="rtl">

      <Navbar
        activeTab={activeTab}
        onNavigateSection={handleNavigateSection}
        onOpenBooking={handleOpenBooking}
      />

      {activeTab === 'home' && activeCategorySlug && (
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center bg-[#101D2D] text-[#C9A96B] text-sm">
              جاري تحميل صفحة الفئة...
            </div>
          }
        >
          <LazyServiceCategoryPage
            slug={activeCategorySlug}
            pricingRules={pricingRules}
            onNavigateHome={() => handleNavigateSection('home')}
            onNavigateCategory={handleOpenCategoryPage}
            onBookCategory={handleOpenBookingWithCategory}
          />
        </Suspense>
      )}

      {activeTab === 'home' && !activeCategorySlug && (
        <main>
          <Hero
            onOpenBooking={handleOpenBooking}
            onNavigateServices={() => handleNavigateSection('services')}
          />
          <QuickBookingBar
            pricingRules={pricingRules}
            onStartBooking={handleQuickBooking}
          />
          <ServicesSection
            pricingRules={pricingRules}
            onSelectTransfer={handleOpenAirportTransfer}
            onOpenCategoryPage={handleOpenCategoryPage}
          />
          <DailyRentalSection
            onSelectPackage={handleOpenDailyRental}
          />
          <WhyAlWakeelSection />
          <FleetSection
            onSelectCategory={handleOpenBookingWithCategory}
            onOpenCategoryPage={handleOpenCategoryPage}
          />
          <DestinationsSection
            services={services}
            pricingRules={pricingRules}
            onSelectDestination={handleOpenBookingWithDestination}
            onOpenBooking={handleOpenBooking}
          />
          <ContactSection />
          <FAQSection onOpenBooking={handleOpenBooking} />
        </main>
      )}

      {activeTab === 'my-bookings' && (
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center text-[#C9A96B] font-medium text-sm">
              جاري تحميل سجل الحجوزات...
            </div>
          }
        >
          <LazyCustomerBookings onOpenBooking={handleOpenBooking} />
        </Suspense>
      )}

      {activeTab === 'admin' && (
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center text-[#C9A96B] font-medium text-sm">
              جاري تحميل لوحة التحكم الإدارية...
            </div>
          }
        >
          <LazyAdminDashboard
            services={services}
            vehicles={vehicles}
            pricingRules={pricingRules}
            onPricingRulesUpdated={handlePricingRulesUpdated}
          />
        </Suspense>
      )}

      <Footer
        onNavigate={handleNavigateSection}
        onOpenBooking={handleOpenBooking}
        onOpenCategoryPage={handleOpenCategoryPage}
      />

      {hasMountedBooking && (
        <Suspense fallback={null}>
          <LazyBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        pricingRules={pricingRules}
        initialBookingMode={bookingMode}
        preselectedDailyPackageId={preselectedDailyPackageId}
        preselectedOrigin={preselectedOrigin}
        preselectedDestination={preselectedDestination}
        preselectedDate={preselectedDate}
        preselectedTime={preselectedTime}
        preselectedPassengers={preselectedPassengers}
        preselectedCategory={preselectedCategory}
        preselectedService={preselectedService}
        openedFromQuickBar={bookingOpenedFromQuickBar}
        openTriggerNonce={bookingOpenNonce}
        returnToStepAfterEdit={pendingEditReturnStep}
        onClearReturnStep={() => setPendingEditReturnStep(null)}
        onEditPassengersAtEntry={handleEditPassengersInQuickBar}
        onBookingSubmitted={() => {
          setActiveTab('my-bookings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
          />
        </Suspense>
      )}

      <WhatsAppFab />
      <OfflineIndicator />

    </div>
  );
}
