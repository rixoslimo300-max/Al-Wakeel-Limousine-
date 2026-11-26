import React, { useState, useEffect, useMemo } from 'react';
import { Service, PricingRule, ServiceCategoryKey } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Briefcase,
  Phone,
  Building2,
  User as UserIcon,
  Plane,
  Car,
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Edit3,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import {
  DAILY_RENTAL_PACKAGES,
  OFFICIAL_TEL_HREF,
  OFFICIAL_WHATSAPP_NUMBER,
  DailyRentalPackageId,
  getDailyRentalPackage,
  calculateTripQuote,
  buildDailyRentalWhatsAppMessage,
  buildDailyRentalWhatsAppUrl,
} from '../lib/bookingEngine';
import {
  TRIP_TYPE_OPTIONS,
  VEHICLE_PREFERENCE_OPTIONS,
  WHATSAPP_CONSENT_TEXT_AR,
  WHATSAPP_PREPARED_INSTRUCTION_AR,
  WHATSAPP_COMPANY_PHONE_DISPLAY,
  WhatsAppBookingFormData,
  BookingValidationErrors,
  TripTypeOption,
  VehiclePreferenceOption,
  validateSectionA,
  validateSectionB,
  validateSectionC,
  validateWhatsAppBookingForm,
  buildStructuredWhatsAppBookingMessage,
  buildWhatsAppClickToChatUrl,
  buildWhatsAppWebFallbackUrl,
  openWhatsAppSafely,
  formatReadableDate,
  formatReadableTime,
  inferTripTypeFromRoute,
} from '../lib/whatsappBooking';

export type BookingFlowMode = 'transfer' | 'daily_rental';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  pricingRules: PricingRule[];
  initialBookingMode?: BookingFlowMode;
  preselectedDailyPackageId?: DailyRentalPackageId | null;
  preselectedOrigin?: string | null;
  preselectedDestination?: string | null;
  preselectedDate?: string | null;
  preselectedTime?: string | null;
  preselectedPassengers?: number | null;
  preselectedCategory?: ServiceCategoryKey | null;
  preselectedService?: Service | null;
  onBookingSubmitted?: () => void;
}

const QUICK_LOCATIONS = [
  'الإسكندرية',
  'مطار برج العرب الدولي',
  'مطار القاهرة الدولي',
  'مطار سفنكس الدولي',
  'الساحل الشمالي / مارينا',
];

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5.016l-1.406 5.141 5.266-1.375c1.484.813 3.141 1.234 4.766 1.234 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406.016.578.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.531-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.5.125.688-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.891.891 2.219 1.047.328.156.547.234.625.359.078.125.078.734-.172 1.438z" />
  </svg>
);

function mapCategoryToVehiclePref(category?: ServiceCategoryKey | null): VehiclePreferenceOption | '' {
  if (category === 'sedan_comfort') return 'سيدان';
  if (category === 'suv_premium') return 'SUV';
  if (category === 'mini_van') return 'فان / Hiace';
  return '';
}

function mapVehiclePrefToCategory(pref: VehiclePreferenceOption | ''): ServiceCategoryKey | null {
  if (pref === 'سيدان') return 'sedan_comfort';
  if (pref === 'SUV') return 'suv_premium';
  if (pref === 'فان / Hiace') return 'mini_van';
  return null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  pricingRules,
  initialBookingMode = 'transfer',
  preselectedDailyPackageId,
  preselectedOrigin,
  preselectedDestination,
  preselectedDate,
  preselectedTime,
  preselectedPassengers,
  preselectedCategory,
}) => {
  const [bookingMode, setBookingMode] = useState<BookingFlowMode>(initialBookingMode);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Primary 4-Section WhatsApp Trip Booking State
  const [formData, setFormData] = useState<WhatsAppBookingFormData>({
    fullName: '',
    phone: '',
    companyName: '',
    tripType: 'توصيل إلى المطار',
    pickupLocation: 'الإسكندرية',
    dropoffLocation: 'مطار برج العرب الدولي',
    tripDate: '',
    tripTime: '',
    airline: '',
    flightNumber: '',
    actualArrivalTime: '',
    passengersCount: '2',
    luggageCount: '',
    vehiclePreference: '',
    hasReturnTrip: false,
    returnDate: '',
    returnTime: '',
    returnPickupLocation: '',
    returnDropoffLocation: '',
    notes: '',
    consentAccepted: false,
  });

  const [errors, setErrors] = useState<BookingValidationErrors>({});

  // Daily Rental State (preserved independent mode)
  const [dailyPackageId, setDailyPackageId] = useState<DailyRentalPackageId>('daily-rental-8h');
  const [dailyUsageDate, setDailyUsageDate] = useState<string>('');
  const [dailyStartTime, setDailyStartTime] = useState<string>('');
  const [dailyName, setDailyName] = useState<string>('');
  const [dailyPhone, setDailyPhone] = useState<string>('');
  const [dailyNotes, setDailyNotes] = useState<string>('');
  const [dailyConsent, setDailyConsent] = useState<boolean>(false);
  const [dailyErrors, setDailyErrors] = useState<Record<string, string>>({});

  // Prepared WhatsApp Output Banner State (never clears user form)
  const [isLaunchingWhatsApp, setIsLaunchingWhatsApp] = useState(false);
  const [preparedWhatsApp, setPreparedWhatsApp] = useState<{
    mode: BookingFlowMode;
    waUrl: string;
    waWebUrl: string;
    openedProgrammatically: boolean;
  } | null>(null);

  // Initialize defaults cleanly whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    const initOrigin = preselectedOrigin || 'الإسكندرية';
    const initDest = preselectedDestination || 'مطار برج العرب الدولي';
    const initTripType = inferTripTypeFromRoute(initOrigin, initDest);
    const initPax =
      preselectedPassengers && preselectedPassengers >= 1
        ? String(preselectedPassengers)
        : '2';

    setBookingMode(initialBookingMode);
    setStep(1);
    setErrors({});
    setDailyErrors({});
    setPreparedWhatsApp(null);
    setIsLaunchingWhatsApp(false);

    setFormData((prev) => ({
      ...prev,
      tripType: initTripType,
      pickupLocation: initOrigin,
      dropoffLocation: initDest,
      tripDate: preselectedDate || prev.tripDate,
      tripTime: preselectedTime || prev.tripTime,
      passengersCount: initPax,
      vehiclePreference: mapCategoryToVehiclePref(preselectedCategory) || prev.vehiclePreference,
    }));

    setDailyPackageId(preselectedDailyPackageId || 'daily-rental-8h');
    setDailyUsageDate(preselectedDate || '');
    setDailyStartTime(preselectedTime || '');
  }, [
    isOpen,
    initialBookingMode,
    preselectedDailyPackageId,
    preselectedOrigin,
    preselectedDestination,
    preselectedDate,
    preselectedTime,
    preselectedPassengers,
    preselectedCategory,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const updateField = <K extends keyof WhatsAppBookingFormData>(
    field: K,
    value: WhatsAppBookingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (preparedWhatsApp) {
      setPreparedWhatsApp(null);
    }
  };

  // Optional live price guidance for known airport routes (never blocks custom routes)
  const referenceFareHint = useMemo(() => {
    const paxNum = Number(formData.passengersCount);
    const mappedCat = mapVehiclePrefToCategory(formData.vehiclePreference);
    if (!Number.isInteger(paxNum) || paxNum < 1 || paxNum > 3 || !mappedCat) {
      return null;
    }
    const q = calculateTripQuote({
      origin: formData.pickupLocation,
      destination: formData.dropoffLocation,
      passengersCount: paxNum,
      serviceCategory: mappedCat,
      pricingRules,
    });
    return q.fixedPrice;
  }, [
    formData.passengersCount,
    formData.vehiclePreference,
    formData.pickupLocation,
    formData.dropoffLocation,
    pricingRules,
  ]);

  if (!isOpen) return null;

  const activeDailyPackage = getDailyRentalPackage(dailyPackageId);

  const handleSwapRoute = () => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: prev.dropoffLocation,
      dropoffLocation: prev.pickupLocation,
      tripType: inferTripTypeFromRoute(prev.dropoffLocation, prev.pickupLocation),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pickupLocation;
      delete next.dropoffLocation;
      return next;
    });
  };

  const handleAutoFillReturnFromOutbound = () => {
    setFormData((prev) => ({
      ...prev,
      returnPickupLocation: prev.dropoffLocation,
      returnDropoffLocation: prev.pickupLocation,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.returnPickupLocation;
      delete next.returnDropoffLocation;
      return next;
    });
  };

  const handleGoToStep = (targetStep: 1 | 2 | 3 | 4) => {
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    if (step === 1) {
      const errA = validateSectionA(formData);
      if (Object.keys(errA).length > 0) {
        setErrors((prev) => ({ ...prev, ...errA }));
        return;
      }
    } else if (step === 2) {
      const errB = validateSectionB(formData);
      if (Object.keys(errB).length > 0) {
        setErrors((prev) => ({ ...prev, ...errB }));
        return;
      }
    } else if (step === 3) {
      const errC = validateSectionC(formData);
      if (Object.keys(errC).length > 0) {
        setErrors((prev) => ({ ...prev, ...errC }));
        return;
      }
    }

    if (targetStep === 4) {
      // Ensure earlier steps are all valid before reaching final review
      const errA = validateSectionA(formData);
      const errB = validateSectionB(formData);
      const errC = validateSectionC(formData);
      const combined = { ...errA, ...errB, ...errC };
      if (Object.keys(combined).length > 0) {
        setErrors(combined);
        if (Object.keys(errA).length > 0) setStep(1);
        else if (Object.keys(errB).length > 0) setStep(2);
        else setStep(3);
        return;
      }
    }

    setStep(targetStep);
  };

  const handleNext = () => {
    if (step === 1) handleGoToStep(2);
    else if (step === 2) handleGoToStep(3);
    else if (step === 3) handleGoToStep(4);
  };

  const handleSubmitWhatsAppTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLaunchingWhatsApp) return;

    const validation = validateWhatsAppBookingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      if (validation.firstInvalidStep) {
        setStep(validation.firstInvalidStep);
      }
      return;
    }

    setIsLaunchingWhatsApp(true);
    const message = buildStructuredWhatsAppBookingMessage(formData);
    const waUrl = buildWhatsAppClickToChatUrl(message);
    const waWebUrl = buildWhatsAppWebFallbackUrl(message);
    const openedProgrammatically = openWhatsAppSafely(waUrl);

    setPreparedWhatsApp({
      mode: 'transfer',
      waUrl,
      waWebUrl,
      openedProgrammatically,
    });

    setTimeout(() => {
      setIsLaunchingWhatsApp(false);
    }, 600);
  };

  const handleSubmitDailyRentalWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLaunchingWhatsApp) return;

    const nextErr: Record<string, string> = {};
    if (!dailyUsageDate.trim()) nextErr.dailyUsageDate = 'يرجى تحديد تاريخ الاستخدام.';
    if (!dailyStartTime.trim()) nextErr.dailyStartTime = 'يرجى تحديد وقت البدء.';
    if (!dailyName.trim()) nextErr.dailyName = 'يرجى إدخال الاسم بالكامل.';
    if (!dailyPhone.trim() || dailyPhone.replace(/\D/g, '').length < 7) {
      nextErr.dailyPhone = 'يرجى إدخال رقم هاتف صحيح.';
    }
    if (!dailyConsent) {
      nextErr.dailyConsent = 'يرجى الموافقة على مشاركة بيانات الحجز لإتمام تجهيز الطلب.';
    }

    if (Object.keys(nextErr).length > 0) {
      setDailyErrors(nextErr);
      return;
    }

    setDailyErrors({});
    setIsLaunchingWhatsApp(true);

    const message = buildDailyRentalWhatsAppMessage({
      customerName: dailyName.trim(),
      customerPhone: dailyPhone.trim(),
      pkg: activeDailyPackage,
      usageDate: dailyUsageDate,
      startTime: dailyStartTime,
      notes: dailyNotes,
    });
    const waUrl = buildDailyRentalWhatsAppUrl({
      customerName: dailyName.trim(),
      customerPhone: dailyPhone.trim(),
      pkg: activeDailyPackage,
      usageDate: dailyUsageDate,
      startTime: dailyStartTime,
      notes: dailyNotes,
    });
    const waWebUrl = buildWhatsAppWebFallbackUrl(message);
    const openedProgrammatically = openWhatsAppSafely(waUrl);

    setPreparedWhatsApp({
      mode: 'daily_rental',
      waUrl,
      waWebUrl,
      openedProgrammatically,
    });

    setTimeout(() => {
      setIsLaunchingWhatsApp(false);
    }, 600);
  };

  const stepMeta: Array<{ num: 1 | 2 | 3 | 4; label: string }> = [
    { num: 1, label: '1. بيانات العميل' },
    { num: 2, label: '2. تفاصيل الرحلة' },
    { num: 3, label: '3. الركاب والسيارة' },
    { num: 4, label: '4. المراجعة والإرسال' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0B1522]/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      dir="rtl"
    >
      <div className="relative w-full max-w-3xl bg-[#152438] border border-[#C9A96B]/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-3 text-right text-[#F6F5F1]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 bg-[#101D2D] border-b border-[#C9A96B]/20 gap-3">
          <div className="min-w-0">
            <h2 id="booking-modal-title" className="font-card-heading text-white truncate">
              {bookingMode === 'daily_rental'
                ? 'حجز التأجير اليومي داخل الإسكندرية'
                : 'طلب حجز رحلة — الوكيل ليموزين'}
            </h2>
            <p className="font-label text-[#91B9C8] mt-0.5">
              تجهيز وإرسال طلب الحجز مباشرة إلى واتساب الشركة{' '}
              <span dir="ltr" className="font-latin text-[#C9A96B] tabular-nums">
                {WHATSAPP_COMPANY_PHONE_DISPLAY}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة الحجز"
            className="text-[#9A9A96] hover:text-white bg-[#152438] w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 border border-[#C9A96B]/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-7 space-y-5 max-h-[84vh] overflow-y-auto">

          {/* Service Mode Switcher */}
          <div
            className="grid grid-cols-2 gap-2 p-1 bg-[#101D2D] border border-[#C9A96B]/25 rounded-xl"
            role="tablist"
            aria-label="نوع الخدمة"
          >
            <button
              type="button"
              role="tab"
              aria-selected={bookingMode === 'transfer'}
              onClick={() => {
                setBookingMode('transfer');
                setPreparedWhatsApp(null);
              }}
              className={`min-h-[42px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                bookingMode === 'transfer'
                  ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                  : 'text-[#9A9A96] hover:text-white'
              }`}
            >
              حجز رحلة / انتقال مطار
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={bookingMode === 'daily_rental'}
              onClick={() => {
                setBookingMode('daily_rental');
                setPreparedWhatsApp(null);
              }}
              className={`min-h-[42px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                bookingMode === 'daily_rental'
                  ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                  : 'text-[#9A9A96] hover:text-white'
              }`}
            >
              التأجير اليومي بالإسكندرية
            </button>
          </div>

          {/* Prepared WhatsApp Instruction Banner (Never falsely claims confirmation) */}
          {preparedWhatsApp && (
            <div
              role="status"
              aria-live="polite"
              className="bg-[#101D2D] border border-[#C9A96B]/55 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A96B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-subheading text-[#DFC89B]">
                    الخطوة الأخيرة: أتمم الإرسال داخل واتساب
                  </h3>
                  <p className="font-body text-[#F6F5F1] leading-relaxed">
                    {WHATSAPP_PREPARED_INSTRUCTION_AR}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                <a
                  href={preparedWhatsApp.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <WhatsAppGlyph className="w-4 h-4 shrink-0" />
                  <span>فتح واتساب لإرسال الطلب</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <a
                  href={preparedWhatsApp.waWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#152438] hover:bg-[#1c2f48] border border-[#C9A96B]/35 text-[#F6F5F1] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>فتح عبر واتساب ويب (WhatsApp Web)</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#C9A96B]" />
                </a>

                <button
                  type="button"
                  onClick={() => setPreparedWhatsApp(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#C9A96B]/20 text-xs sm:text-sm text-[#91B9C8] hover:text-white transition-colors"
                >
                  تعديل البيانات
                </button>
              </div>
            </div>
          )}

          {bookingMode === 'daily_rental' ? (
            /* ========================================================= */
            /* DAILY RENTAL — ALEXANDRIA WHATSAPP BOOKING FLOW           */
            /* ========================================================= */
            <form onSubmit={handleSubmitDailyRentalWhatsApp} noValidate className="space-y-5">
              <div>
                <h3 className="font-subheading text-white">اختر باقة التأجير اليومي داخل الإسكندرية *</h3>
                <p className="font-sub text-[#9A9A96] mt-0.5">
                  متاح باقتان فقط بنطاق الاستخدام داخل الإسكندرية.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DAILY_RENTAL_PACKAGES.map((pkg) => {
                  const isSelected = dailyPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setDailyPackageId(pkg.id)}
                      className={`text-right rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#101D2D] border-[#C9A96B] ring-1 ring-[#C9A96B]/60 shadow-lg'
                          : 'bg-[#101D2D]/70 border-[#C9A96B]/20 hover:border-[#C9A96B]/55'
                      }`}
                    >
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <span dir="ltr" className="font-latin text-xs font-semibold text-[#C9A96B]">
                            {pkg.titleEn}
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              isSelected
                                ? 'bg-[#C9A96B] border-[#C9A96B] text-[#101D2D]'
                                : 'border-[#C9A96B]/35 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <h4 className="font-card-heading text-white">{pkg.titleAr}</h4>
                        <p className="font-sub text-[#9A9A96]">
                          {pkg.durationLabelAr} · {pkg.distanceLabelAr} · {pkg.scopeLabelAr}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#C9A96B]/15 w-full flex items-center justify-between">
                        <span className="font-label text-[#91B9C8]">سعر الباقة:</span>
                        <span className="text-base sm:text-lg font-bold text-[#C9A96B] tabular-nums">
                          {pkg.priceEgp.toLocaleString('en-US')} جنيه مصري
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="daily-date" className="block font-label text-[#91B9C8] mb-1.5">
                    تاريخ الاستخدام *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                    <input
                      id="daily-date"
                      type="date"
                      value={dailyUsageDate}
                      onChange={(e) => {
                        setDailyUsageDate(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyUsageDate: '' }));
                      }}
                      className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                    />
                  </div>
                  {dailyErrors.dailyUsageDate && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{dailyErrors.dailyUsageDate}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="daily-time" className="block font-label text-[#91B9C8] mb-1.5">
                    وقت البدء *
                  </label>
                  <div className="relative">
                    <Clock className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                    <input
                      id="daily-time"
                      type="time"
                      value={dailyStartTime}
                      onChange={(e) => {
                        setDailyStartTime(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyStartTime: '' }));
                      }}
                      className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                    />
                  </div>
                  {dailyErrors.dailyStartTime && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{dailyErrors.dailyStartTime}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="daily-name" className="block font-label text-[#91B9C8] mb-1.5">
                    الاسم بالكامل *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-[#9A9A96] pointer-events-none" />
                    <input
                      id="daily-name"
                      type="text"
                      placeholder="الاسم الكامل"
                      value={dailyName}
                      onChange={(e) => {
                        setDailyName(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyName: '' }));
                      }}
                      className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                    />
                  </div>
                  {dailyErrors.dailyName && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{dailyErrors.dailyName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="daily-phone" className="block font-label text-[#91B9C8] mb-1.5">
                    رقم الهاتف / واتساب *
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-[#9A9A96] pointer-events-none" />
                    <input
                      id="daily-phone"
                      type="tel"
                      dir="ltr"
                      placeholder="+20 10..."
                      value={dailyPhone}
                      onChange={(e) => {
                        setDailyPhone(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyPhone: '' }));
                      }}
                      className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none text-left"
                    />
                  </div>
                  {dailyErrors.dailyPhone && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{dailyErrors.dailyPhone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="daily-notes" className="block font-label text-[#91B9C8] mb-1.5">
                  ملاحظات إضافية أو عنوان الاستلام داخل الإسكندرية (اختياري)
                </label>
                <textarea
                  id="daily-notes"
                  rows={2}
                  placeholder="تفاصيل الاستلام أو المتطلبات الخاصة..."
                  value={dailyNotes}
                  onChange={(e) => setDailyNotes(e.target.value)}
                  className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl p-3.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                />
              </div>

              <div className="bg-[#101D2D] border border-[#C9A96B]/25 rounded-2xl p-4 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dailyConsent}
                    onChange={(e) => {
                      setDailyConsent(e.target.checked);
                      setDailyErrors((p) => ({ ...p, dailyConsent: '' }));
                    }}
                    className="mt-1 w-4 h-4 accent-[#C9A96B] rounded shrink-0 cursor-pointer"
                  />
                  <span className="font-sub text-[#F6F5F1] leading-relaxed">
                    {WHATSAPP_CONSENT_TEXT_AR}
                  </span>
                </label>
                {dailyErrors.dailyConsent && (
                  <p className="text-xs text-red-300 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{dailyErrors.dailyConsent}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#C9A96B]/20">
                <a
                  href={OFFICIAL_TEL_HREF}
                  className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9A96B]" />
                  <span>اتصال مباشر:</span>
                  <span dir="ltr" className="font-latin tabular-nums">{OFFICIAL_WHATSAPP_NUMBER}</span>
                </a>

                <button
                  type="submit"
                  disabled={isLaunchingWhatsApp}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base shadow-lg inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <WhatsAppGlyph className="w-4 h-4 shrink-0" />
                  <span>إرسال طلب الحجز عبر واتساب</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================= */
            /* 4-SECTION ARABIC RTL TRIP BOOKING TO WHATSAPP WORKFLOW    */
            /* ========================================================= */
            <form onSubmit={handleSubmitWhatsAppTrip} noValidate className="space-y-6">

              {/* 4-Step Progress Indicator */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label="مراحل نموذج الحجز">
                  {stepMeta.map((item) => {
                    const isCurrent = step === item.num;
                    const isVisited = step > item.num;
                    return (
                      <button
                        key={item.num}
                        type="button"
                        onClick={() => handleGoToStep(item.num)}
                        className={`min-h-[42px] py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${
                          isCurrent
                            ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold shadow-sm'
                            : isVisited
                              ? 'bg-[#101D2D] text-[#C9A96B] border-[#C9A96B]/45 hover:border-[#C9A96B]'
                              : 'bg-[#101D2D]/60 text-[#9A9A96] border-[#C9A96B]/15 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div className="w-full h-1 bg-[#101D2D] rounded-full overflow-hidden" aria-hidden="true">
                  <div
                    className="h-full bg-[#C9A96B] transition-all duration-300 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* ===================================================== */}
              {/* SECTION A — CUSTOMER INFORMATION                      */}
              {/* ===================================================== */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-label text-[#C9A96B]">القسم الأول · أولاً: بيانات العميل</span>
                    <h3 className="font-subheading text-white">بيانات التواصل الأساسية</h3>
                    <p className="font-sub text-[#9A9A96]">
                      تُستخدم هذه البيانات لمراجعة طلبك والتواصل معك عبر واتساب أو الهاتف.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="wa-fullname" className="block font-label text-[#91B9C8] mb-1.5">
                        الاسم بالكامل *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="wa-fullname"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="مثال: أحمد محمود الوكيل"
                          value={formData.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.fullName ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="wa-phone" className="block font-label text-[#91B9C8] mb-1.5">
                        رقم الهاتف / واتساب *
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="wa-phone"
                          type="tel"
                          dir="ltr"
                          required
                          autoComplete="tel"
                          placeholder="+20 100 000 0000"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white text-left placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.phone ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="wa-company" className="block font-label text-[#91B9C8] mb-1.5">
                      اسم الشركة أو الجهة (اختياري)
                    </label>
                    <div className="relative">
                      <Building2 className="absolute right-3.5 top-3.5 w-4 h-4 text-[#9A9A96] pointer-events-none" />
                      <input
                        id="wa-company"
                        type="text"
                        autoComplete="organization"
                        placeholder="في حال كان الحجز لجهة عمل أو شركة أو وفد"
                        value={formData.companyName}
                        onChange={(e) => updateField('companyName', e.target.value)}
                        className="w-full min-h-[48px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-[#C9A96B]/15">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto min-h-[48px] px-7 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm inline-flex items-center justify-center gap-2 transition-all"
                    >
                      <span>التالي: تفاصيل الرحلة</span>
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* SECTION B — TRIP INFORMATION                          */}
              {/* ===================================================== */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-label text-[#C9A96B]">القسم الثاني · ثانياً: تفاصيل الرحلة</span>
                      <h3 className="font-subheading text-white">نوع الرحلة والمسار والموعد</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleSwapRoute}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-[#101D2D] border border-[#C9A96B]/30 text-xs font-medium text-[#C9A96B] hover:border-[#C9A96B]"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>عكس الاتجاه</span>
                    </button>
                  </div>

                  {/* Trip Type */}
                  <div>
                    <label htmlFor="wa-trip-type" className="block font-label text-[#91B9C8] mb-2">
                      نوع الرحلة *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TRIP_TYPE_OPTIONS.map((typeOption) => {
                        const active = formData.tripType === typeOption;
                        return (
                          <button
                            key={typeOption}
                            type="button"
                            onClick={() => updateField('tripType', typeOption as TripTypeOption)}
                            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors text-center ${
                              active
                                ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                                : 'bg-[#101D2D] text-[#F6F5F1] border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                            }`}
                          >
                            {typeOption}
                          </button>
                        );
                      })}
                    </div>
                    {errors.tripType && (
                      <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.tripType}</span>
                      </p>
                    )}
                  </div>

                  {/* Pickup & Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="wa-pickup" className="block font-label text-[#91B9C8] mb-1.5">
                        مكان التحرك *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="wa-pickup"
                          type="text"
                          required
                          placeholder="أدخل نقطة التحرك أو اختر من الأسفل"
                          value={formData.pickupLocation}
                          onChange={(e) => updateField('pickupLocation', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.pickupLocation ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {QUICK_LOCATIONS.slice(0, 4).map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => updateField('pickupLocation', loc)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#101D2D] border border-[#C9A96B]/20 text-[#91B9C8] hover:text-white hover:border-[#C9A96B]/50 transition-colors"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                      {errors.pickupLocation && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.pickupLocation}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="wa-dropoff" className="block font-label text-[#91B9C8] mb-1.5">
                        الوجهة *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="wa-dropoff"
                          type="text"
                          required
                          placeholder="أدخل الوجهة أو اختر من الأسفل"
                          value={formData.dropoffLocation}
                          onChange={(e) => updateField('dropoffLocation', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.dropoffLocation ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {QUICK_LOCATIONS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => updateField('dropoffLocation', loc)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#101D2D] border border-[#C9A96B]/20 text-[#91B9C8] hover:text-white hover:border-[#C9A96B]/50 transition-colors"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                      {errors.dropoffLocation && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.dropoffLocation}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="wa-date" className="block font-label text-[#91B9C8] mb-1.5">
                        تاريخ الرحلة *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="wa-date"
                          type="date"
                          required
                          value={formData.tripDate}
                          onChange={(e) => updateField('tripDate', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none ${
                            errors.tripDate ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.tripDate && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.tripDate}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="wa-time" className="block font-label text-[#91B9C8] mb-1.5">
                        وقت التحرك *
                      </label>
                      <div className="relative">
                        <Clock className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="wa-time"
                          type="time"
                          required
                          value={formData.tripTime}
                          onChange={(e) => updateField('tripTime', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none ${
                            errors.tripTime ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.tripTime && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.tripTime}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Optional Flight Details */}
                  <div className="bg-[#101D2D]/70 border border-[#C9A96B]/20 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 font-label text-[#91B9C8]">
                      <Plane className="w-4 h-4 text-[#C9A96B] shrink-0" />
                      <span>بيانات الطيران وموعد الوصول الفعلي (اختياري)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="wa-airline" className="block text-xs text-[#9A9A96] mb-1">
                          شركة الطيران
                        </label>
                        <input
                          id="wa-airline"
                          type="text"
                          placeholder="مثال: مصر للطيران"
                          value={formData.airline}
                          onChange={(e) => updateField('airline', e.target.value)}
                          className="w-full min-h-[44px] bg-[#152438] border border-[#C9A96B]/25 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="wa-flight" className="block text-xs text-[#9A9A96] mb-1">
                          رقم الرحلة الجوية
                        </label>
                        <input
                          id="wa-flight"
                          type="text"
                          dir="ltr"
                          placeholder="MS 612"
                          value={formData.flightNumber}
                          onChange={(e) => updateField('flightNumber', e.target.value)}
                          className="w-full min-h-[44px] bg-[#152438] border border-[#C9A96B]/25 rounded-xl px-3.5 py-2 text-sm text-white text-left placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="wa-actual-arrival" className="block text-xs text-[#9A9A96] mb-1">
                          موعد الوصول الفعلي (إن اختلف)
                        </label>
                        <input
                          id="wa-actual-arrival"
                          type="time"
                          value={formData.actualArrivalTime}
                          onChange={(e) => updateField('actualArrivalTime', e.target.value)}
                          className="w-full min-h-[44px] bg-[#152438] border border-[#C9A96B]/25 rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#C9A96B]/15">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#101D2D] border border-[#C9A96B]/25 text-sm text-[#9A9A96] hover:text-white inline-flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm inline-flex items-center gap-2 transition-all"
                    >
                      <span>التالي: الركاب والسيارة</span>
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* SECTION C — PASSENGERS AND VEHICLE REQUIREMENTS       */}
              {/* ===================================================== */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-label text-[#C9A96B]">القسم الثالث · ثالثاً: تفاصيل التنفيذ</span>
                    <h3 className="font-subheading text-white">الركاب، الأمتعة، السيارة، ورحلة العودة</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="wa-passengers" className="block font-label text-[#91B9C8] mb-1.5">
                        عدد الركاب *
                      </label>
                      <div className="relative">
                        <Users className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="wa-passengers"
                          type="number"
                          min={1}
                          step={1}
                          required
                          value={formData.passengersCount}
                          onChange={(e) => updateField('passengersCount', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none tabular-nums ${
                            errors.passengersCount ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.passengersCount && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.passengersCount}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="wa-luggage" className="block font-label text-[#91B9C8] mb-1.5">
                        عدد الحقائب (اختياري)
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute right-3.5 top-3.5 w-4 h-4 text-[#9A9A96] pointer-events-none" />
                        <input
                          id="wa-luggage"
                          type="number"
                          min={0}
                          step={1}
                          placeholder="مثال: 2"
                          value={formData.luggageCount}
                          onChange={(e) => updateField('luggageCount', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none tabular-nums ${
                            errors.luggageCount ? 'border-red-400 focus:border-red-400' : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.luggageCount && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.luggageCount}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Preference */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="font-label text-[#91B9C8] flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-[#C9A96B]" />
                        <span>نوع السيارة المطلوبة (اختياري)</span>
                      </label>
                      {formData.vehiclePreference && (
                        <button
                          type="button"
                          onClick={() => updateField('vehiclePreference', '')}
                          className="text-xs text-[#9A9A96] hover:text-white"
                        >
                          إلغاء الاختيار
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {VEHICLE_PREFERENCE_OPTIONS.map((option) => {
                        const active = formData.vehiclePreference === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField('vehiclePreference', option)}
                            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                              active
                                ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                                : 'bg-[#101D2D] text-[#F6F5F1] border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Return Trip Toggle & Conditional Fields */}
                  <div className="bg-[#101D2D]/80 border border-[#C9A96B]/25 rounded-2xl p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-subheading text-white">هل توجد رحلة عودة؟</p>
                        <p className="font-sub text-[#9A9A96]">
                          في حال اختيار "نعم"، تصبح بيانات العودة مطلوبة لإدراجها في طلب الواتساب.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 shrink-0 min-w-[160px]">
                        <button
                          type="button"
                          onClick={() => updateField('hasReturnTrip', true)}
                          className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                            formData.hasReturnTrip
                              ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                              : 'bg-[#152438] text-[#F6F5F1] border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                          }`}
                        >
                          نعم
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateField('hasReturnTrip', false);
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.returnDate;
                              delete next.returnTime;
                              delete next.returnPickupLocation;
                              delete next.returnDropoffLocation;
                              return next;
                            });
                          }}
                          className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                            !formData.hasReturnTrip
                              ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                              : 'bg-[#152438] text-[#F6F5F1] border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                          }`}
                        >
                          لا
                        </button>
                      </div>
                    </div>

                    {formData.hasReturnTrip && (
                      <div className="pt-3 border-t border-[#C9A96B]/20 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-label text-[#DFC89B]">تفاصيل رحلة العودة *</span>
                          <button
                            type="button"
                            onClick={handleAutoFillReturnFromOutbound}
                            className="text-xs text-[#C9A96B] hover:text-[#DFC89B] inline-flex items-center gap-1"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            <span>نسخ عكس مسار الذهاب</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label htmlFor="wa-return-date" className="block font-label text-[#91B9C8] mb-1">
                              تاريخ رحلة العودة *
                            </label>
                            <input
                              id="wa-return-date"
                              type="date"
                              value={formData.returnDate}
                              onChange={(e) => updateField('returnDate', e.target.value)}
                              className={`w-full min-h-[44px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none ${
                                errors.returnDate ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                              }`}
                            />
                            {errors.returnDate && (
                              <p role="alert" className="mt-1 text-xs text-red-300 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.returnDate}</span>
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="wa-return-time" className="block font-label text-[#91B9C8] mb-1">
                              وقت رحلة العودة *
                            </label>
                            <input
                              id="wa-return-time"
                              type="time"
                              value={formData.returnTime}
                              onChange={(e) => updateField('returnTime', e.target.value)}
                              className={`w-full min-h-[44px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none ${
                                errors.returnTime ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                              }`}
                            />
                            {errors.returnTime && (
                              <p role="alert" className="mt-1 text-xs text-red-300 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.returnTime}</span>
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="wa-return-pickup" className="block font-label text-[#91B9C8] mb-1">
                              مكان العودة *
                            </label>
                            <input
                              id="wa-return-pickup"
                              type="text"
                              placeholder="نقطة الانطلاق في العودة"
                              value={formData.returnPickupLocation}
                              onChange={(e) => updateField('returnPickupLocation', e.target.value)}
                              className={`w-full min-h-[44px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                                errors.returnPickupLocation ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                              }`}
                            />
                            {errors.returnPickupLocation && (
                              <p role="alert" className="mt-1 text-xs text-red-300 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.returnPickupLocation}</span>
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="wa-return-dropoff" className="block font-label text-[#91B9C8] mb-1">
                              وجهة العودة *
                            </label>
                            <input
                              id="wa-return-dropoff"
                              type="text"
                              placeholder="الوجهة في العودة"
                              value={formData.returnDropoffLocation}
                              onChange={(e) => updateField('returnDropoffLocation', e.target.value)}
                              className={`w-full min-h-[44px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                                errors.returnDropoffLocation ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                              }`}
                            />
                            {errors.returnDropoffLocation && (
                              <p role="alert" className="mt-1 text-xs text-red-300 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.returnDropoffLocation}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label htmlFor="wa-notes" className="block font-label text-[#91B9C8] mb-1.5">
                      ملاحظات أو متطلبات خاصة (اختياري)
                    </label>
                    <textarea
                      id="wa-notes"
                      rows={2}
                      placeholder="مثال: مقعد أطفال، عنوان تفصيلي للاستلام، أي متطلبات خاصة..."
                      value={formData.notes}
                      onChange={(e) => updateField('notes', e.target.value)}
                      className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl p-3.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#C9A96B]/15">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#101D2D] border border-[#C9A96B]/25 text-sm text-[#9A9A96] hover:text-white inline-flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm inline-flex items-center gap-2 transition-all"
                    >
                      <span>التالي: مراجعة الطلب</span>
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* SECTION D — REVIEW AND WHATSAPP SUBMISSION            */}
              {/* ===================================================== */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-label text-[#C9A96B]">القسم الرابع · المراجعة والإرسال</span>
                    <h3 className="font-subheading text-white">مراجعة كافة تفاصيل طلب الحجز</h3>
                    <p className="font-sub text-[#9A9A96]">
                      راجع بياناتك قبل تجهيز رسالة واتساب. يمكنك تعديل أي قسم بالضغط على زر "تعديل".
                    </p>
                  </div>

                  {/* Structured Summary Blocks */}
                  <div className="space-y-3.5">

                    {/* Customer Summary */}
                    <div className="bg-[#101D2D] border border-[#C9A96B]/25 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-[#C9A96B]/15 pb-2">
                        <h4 className="font-label text-[#C9A96B] font-semibold">أولاً: بيانات العميل</h4>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">الاسم بالكامل:</span>
                          <span className="text-white font-medium">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">رقم الهاتف / واتساب:</span>
                          <span dir="ltr" className="font-latin text-white font-medium tabular-nums">{formData.phone}</span>
                        </div>
                        {formData.companyName.trim() && (
                          <div className="flex justify-between gap-2 sm:col-span-2">
                            <span className="text-[#9A9A96]">الشركة / الجهة:</span>
                            <span className="text-white font-medium">{formData.companyName.trim()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Trip Summary */}
                    <div className="bg-[#101D2D] border border-[#C9A96B]/25 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-[#C9A96B]/15 pb-2">
                        <h4 className="font-label text-[#C9A96B] font-semibold">ثانياً: تفاصيل الرحلة</h4>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">نوع الرحلة:</span>
                          <span className="text-[#DFC89B] font-semibold">{formData.tripType}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">التاريخ والوقت:</span>
                          <span className="text-white font-medium tabular-nums">
                            {formatReadableDate(formData.tripDate)} · {formatReadableTime(formData.tripTime)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">مكان التحرك:</span>
                          <span className="text-white font-medium">{formData.pickupLocation}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">الوجهة:</span>
                          <span className="text-white font-medium">{formData.dropoffLocation}</span>
                        </div>
                        {formData.airline.trim() && (
                          <div className="flex justify-between gap-2">
                            <span className="text-[#9A9A96]">شركة الطيران:</span>
                            <span className="text-white font-medium">{formData.airline.trim()}</span>
                          </div>
                        )}
                        {formData.flightNumber.trim() && (
                          <div className="flex justify-between gap-2">
                            <span className="text-[#9A9A96]">رقم الرحلة الجوية:</span>
                            <span dir="ltr" className="font-latin text-white font-medium">{formData.flightNumber.trim()}</span>
                          </div>
                        )}
                        {formData.actualArrivalTime.trim() && (
                          <div className="flex justify-between gap-2 sm:col-span-2">
                            <span className="text-[#9A9A96]">موعد الوصول الفعلي:</span>
                            <span className="text-white font-medium tabular-nums">
                              {formatReadableTime(formData.actualArrivalTime)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Execution & Return Summary */}
                    <div className="bg-[#101D2D] border border-[#C9A96B]/25 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-[#C9A96B]/15 pb-2">
                        <h4 className="font-label text-[#C9A96B] font-semibold">ثالثاً: تفاصيل التنفيذ</h4>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">عدد الركاب:</span>
                          <span className="text-white font-medium tabular-nums">{formData.passengersCount}</span>
                        </div>
                        {formData.luggageCount.trim() && (
                          <div className="flex justify-between gap-2">
                            <span className="text-[#9A9A96]">عدد الحقائب:</span>
                            <span className="text-white font-medium tabular-nums">{formData.luggageCount.trim()}</span>
                          </div>
                        )}
                        {formData.vehiclePreference && (
                          <div className="flex justify-between gap-2">
                            <span className="text-[#9A9A96]">نوع السيارة المطلوبة:</span>
                            <span className="text-[#DFC89B] font-medium">{formData.vehiclePreference}</span>
                          </div>
                        )}
                        <div className="flex justify-between gap-2">
                          <span className="text-[#9A9A96]">رحلة عودة:</span>
                          <span className="text-white font-medium">{formData.hasReturnTrip ? 'نعم' : 'لا'}</span>
                        </div>
                      </div>

                      {formData.hasReturnTrip && (
                        <div className="mt-2 pt-2.5 border-t border-[#C9A96B]/15 space-y-1.5 text-sm">
                          <p className="font-label text-[#DFC89B]">تفاصيل رحلة العودة:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex justify-between gap-2">
                              <span className="text-[#9A9A96]">التاريخ والوقت:</span>
                              <span className="text-white tabular-nums">
                                {formatReadableDate(formData.returnDate)} · {formatReadableTime(formData.returnTime)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-[#9A9A96]">المسار:</span>
                              <span className="text-white">
                                {formData.returnPickupLocation} ← {formData.returnDropoffLocation}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.notes.trim() && (
                        <div className="mt-2 pt-2.5 border-t border-[#C9A96B]/15 text-sm">
                          <span className="text-[#9A9A96] block mb-0.5">ملاحظات إضافية:</span>
                          <p className="text-white leading-relaxed">{formData.notes.trim()}</p>
                        </div>
                      )}

                      {referenceFareHint !== null && (
                        <div className="mt-2 pt-2.5 border-t border-[#C9A96B]/15 flex items-center justify-between text-sm">
                          <span className="text-[#91B9C8]">السعر المرجعي المعتمد لمسار المطار (اتجاه واحد):</span>
                          <span className="font-bold text-[#C9A96B] tabular-nums">
                            {referenceFareHint.toLocaleString('en-US')} جنيه
                          </span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Consent Checkbox */}
                  <div className="bg-[#101D2D] border border-[#C9A96B]/30 rounded-2xl p-4 space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        id="wa-consent"
                        type="checkbox"
                        checked={formData.consentAccepted}
                        onChange={(e) => updateField('consentAccepted', e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#C9A96B] rounded shrink-0 cursor-pointer"
                      />
                      <span className="font-sub text-[#F6F5F1] leading-relaxed">
                        {WHATSAPP_CONSENT_TEXT_AR}
                      </span>
                    </label>
                    {errors.consentAccepted && (
                      <p role="alert" className="text-xs text-red-300 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.consentAccepted}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#C9A96B]/20">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#101D2D] border border-[#C9A96B]/25 text-sm text-[#9A9A96] hover:text-white inline-flex items-center justify-center gap-1.5"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLaunchingWhatsApp}
                      className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base shadow-lg inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <WhatsAppGlyph className="w-4 h-4 shrink-0" />
                      <span>إرسال طلب الحجز عبر واتساب</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
