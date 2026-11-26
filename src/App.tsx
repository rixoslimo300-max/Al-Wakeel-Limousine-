import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickBookingBar, QuickBookingPreset } from './components/QuickBookingBar';
import { ServicesSection, AirportTransferSelection } from './components/ServicesSection';
import { DailyRentalSection } from './components/DailyRentalSection';
import { WhyAlWakeelSection } from './components/WhyAlWakeelSection';
import { FleetSection } from './components/FleetSection';
import { CustomerBookings } from './components/CustomerBookings';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal, BookingFlowMode } from './components/BookingModal';
import { Footer } from './components/Footer';
import { DestinationsSection } from './components/DestinationsSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection } from './components/FAQSection';
import { WhatsAppFab } from './components/WhatsAppFab';
import { Service, Vehicle, PricingRule, ServiceCategoryKey } from './types';
import { initialServices, initialVehicles, initialPricingRules } from './data/mockData';
import { extractStructuredRouteRules, DailyRentalPackageId } from './lib/bookingEngine';
import {
  db,
  collection,
  getDocs,
  setDoc,
  doc,
  testConnection,
  isOfflineOrNetworkError,
} from './lib/firebase';

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
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  const [bookingMode, setBookingMode] = useState<BookingFlowMode>('transfer');
  const [preselectedDailyPackageId, setPreselectedDailyPackageId] = useState<DailyRentalPackageId | null>(null);

  const [preselectedOrigin, setPreselectedOrigin] = useState<string | null>(null);
  const [preselectedDestination, setPreselectedDestination] = useState<string | null>(null);
  const [preselectedDate, setPreselectedDate] = useState<string | null>(null);
  const [preselectedTime, setPreselectedTime] = useState<string | null>(null);
  const [preselectedPassengers, setPreselectedPassengers] = useState<number | null>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<ServiceCategoryKey | null>(null);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);

  const cached = readCatalogCache();
  const [services, setServices] = useState<Service[]>(cached?.services || initialServices);
  const [vehicles, setVehicles] = useState<Vehicle[]>(cached?.vehicles || initialVehicles);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(
    extractStructuredRouteRules(cached?.pricingRules || initialPricingRules)
  );

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
          await Promise.all(initialServices.map((s) => setDoc(doc(db, 'services', s.id), s)));
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
          await Promise.all(initialVehicles.map((v) => setDoc(doc(db, 'vehicles', v.id), v)));
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
          await Promise.all(initialPricingRules.map((r) => setDoc(doc(db, 'pricingRules', r.id), r)));
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

  const handleOpenBooking = () => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin('الإسكندرية');
    setPreselectedDestination('مطار برج العرب الدولي');
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(2);
    setPreselectedCategory('sedan_comfort');
    setPreselectedService(null);
    setIsBookingOpen(true);
  };

  const handleOpenAirportTransfer = (selection: AirportTransferSelection) => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin(selection.origin);
    setPreselectedDestination(selection.destination);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(2);
    setPreselectedCategory(selection.category);
    setPreselectedService(null);
    setIsBookingOpen(true);
  };

  const handleOpenDailyRental = (packageId: DailyRentalPackageId) => {
    setBookingMode('daily_rental');
    setPreselectedDailyPackageId(packageId);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedService(null);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithDestination = (origin: string, destination: string) => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin(origin);
    setPreselectedDestination(destination);
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(2);
    setPreselectedCategory('sedan_comfort');
    setPreselectedService(null);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithCategory = (category: ServiceCategoryKey) => {
    setBookingMode('transfer');
    setPreselectedDailyPackageId(null);
    setPreselectedOrigin('الإسكندرية');
    setPreselectedDestination('مطار برج العرب الدولي');
    setPreselectedDate(null);
    setPreselectedTime(null);
    setPreselectedPassengers(category === 'mini_van' ? 4 : 2);
    setPreselectedCategory(category);
    setPreselectedService(null);
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
    setIsBookingOpen(true);
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
      setActiveTab(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const wasDifferentTab = activeTab !== 'home';
    setActiveTab('home');

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

    if (wasDifferentTab) {
      setTimeout(scrollTarget, 60);
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

      {activeTab === 'home' && (
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
          />
          <DailyRentalSection
            onSelectPackage={handleOpenDailyRental}
          />
          <WhyAlWakeelSection />
          <FleetSection
            onSelectCategory={handleOpenBookingWithCategory}
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
        <CustomerBookings
          onOpenBooking={handleOpenBooking}
        />
      )}

      {activeTab === 'admin' && (
        <AdminDashboard
          services={services}
          vehicles={vehicles}
          pricingRules={pricingRules}
          onPricingRulesUpdated={handlePricingRulesUpdated}
        />
      )}

      <Footer
        onNavigate={handleNavigateSection}
        onOpenBooking={handleOpenBooking}
      />

      <BookingModal
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
        onBookingSubmitted={() => {
          setActiveTab('my-bookings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <WhatsAppFab />

    </div>
  );
}
