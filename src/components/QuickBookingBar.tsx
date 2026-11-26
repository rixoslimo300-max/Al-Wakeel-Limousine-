import React, { useState, useMemo } from 'react';
import { PricingRule, Service, ServiceCategoryKey } from '../types';
import { Calendar, MapPin, Users, ArrowLeft, ArrowLeftRight } from 'lucide-react';
import {
  STANDARD_JOURNEY_LOCATIONS,
  UNLISTED_ROUTE_QUOTE_MESSAGE_AR,
  calculateTripQuote,
  getDefaultCategoryForPassengers,
  SERVICE_CATEGORIES,
} from '../lib/bookingEngine';

export interface QuickBookingPreset {
  origin?: string;
  destination?: string;
  travelDate?: string;
  travelTime?: string;
  passengersCount?: number;
  serviceCategory?: ServiceCategoryKey | null;
  service?: Service | null;
}

interface QuickBookingBarProps {
  pricingRules: PricingRule[];
  onStartBooking: (preset: QuickBookingPreset) => void;
}

const CUSTOM_VALUE = '__custom__';

export const QuickBookingBar: React.FC<QuickBookingBarProps> = ({
  pricingRules,
  onStartBooking,
}) => {
  const [originSelect, setOriginSelect] = useState<string>('الإسكندرية');
  const [customOrigin, setCustomOrigin] = useState<string>('');
  const [destSelect, setDestSelect] = useState<string>('مطار برج العرب الدولي');
  const [customDest, setCustomDest] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>('');
  const [passengersCount, setPassengersCount] = useState<number>(2);

  const effectiveOrigin = originSelect === CUSTOM_VALUE ? customOrigin.trim() : originSelect;
  const effectiveDestination = destSelect === CUSTOM_VALUE ? customDest.trim() : destSelect;

  const livePreview = useMemo(() => {
    if (!effectiveOrigin || !effectiveDestination) return null;
    if (passengersCount > 5) {
      return {
        type: 'special' as const,
        text: 'أكثر من 5 ركاب: يرجى التواصل معنا مباشرة لترتيب وسيلة النقل المناسبة.',
      };
    }

    if (passengersCount >= 4) {
      const vanQuote = calculateTripQuote({
        origin: effectiveOrigin,
        destination: effectiveDestination,
        passengersCount,
        serviceCategory: 'mini_van',
        pricingRules,
      });
      if (!vanQuote.valid && vanQuote.quoteReason === 'same_location') {
        return { type: 'error' as const, text: vanQuote.messageAr || '' };
      }
      return {
        type: 'minivan' as const,
        text:
          vanQuote.fixedPrice !== null
            ? `${SERVICE_CATEGORIES.mini_van.fullLabelAr}: ${vanQuote.fixedPrice.toLocaleString('en-US')} جنيه`
            : 'فئة ميني فان (4–5 ركاب) — يتطلب تأكيد السعر عبر الإدارة',
      };
    }

    const sedanQuote = calculateTripQuote({
      origin: effectiveOrigin,
      destination: effectiveDestination,
      passengersCount,
      serviceCategory: 'sedan_comfort',
      pricingRules,
    });
    const suvQuote = calculateTripQuote({
      origin: effectiveOrigin,
      destination: effectiveDestination,
      passengersCount,
      serviceCategory: 'suv_premium',
      pricingRules,
    });

    if (!sedanQuote.valid && sedanQuote.quoteReason === 'same_location') {
      return { type: 'error' as const, text: sedanQuote.messageAr || '' };
    }

    if (sedanQuote.fixedPrice !== null && suvQuote.fixedPrice !== null) {
      return {
        type: 'fixed' as const,
        text: `سعر الرحلة (اتجاه واحد): Comfort Sedan ${sedanQuote.fixedPrice.toLocaleString('en-US')} جنيه · Premium SUV ${suvQuote.fixedPrice.toLocaleString('en-US')} جنيه`,
      };
    }

    return {
      type: 'quote' as const,
      text: UNLISTED_ROUTE_QUOTE_MESSAGE_AR,
    };
  }, [effectiveOrigin, effectiveDestination, passengersCount, pricingRules]);

  const handleSwapDirection = () => {
    const prevOriginSelect = originSelect;
    const prevCustomOrigin = customOrigin;
    setOriginSelect(destSelect);
    setCustomOrigin(customDest);
    setDestSelect(prevOriginSelect);
    setCustomDest(prevCustomOrigin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBooking({
      origin: effectiveOrigin || 'الإسكندرية',
      destination: effectiveDestination || 'مطار برج العرب الدولي',
      travelDate,
      passengersCount,
      serviceCategory: getDefaultCategoryForPassengers(passengersCount),
    });
  };

  return (
    <section aria-label="حجز الرحلة السريع" className="relative z-20 lg:-mt-10 pb-6 sm:pb-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="bg-[#152438]/95 backdrop-blur-md border border-[#C9A96B]/30 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl shadow-black/40 space-y-3.5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 lg:gap-4 items-end text-right">
            
            {/* Pickup Origin */}
            <div className="lg:col-span-3">
              <label htmlFor="qb-origin" className="block font-label text-[#91B9C8] mb-1.5">
                نقطة الانطلاق
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#C9A96B] absolute right-3.5 top-3.5 pointer-events-none" />
                <select
                  id="qb-origin"
                  value={originSelect}
                  onChange={(e) => setOriginSelect(e.target.value)}
                  className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/25 focus:border-[#C9A96B] rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white focus:outline-none"
                >
                  {STANDARD_JOURNEY_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.labelAr}>
                      {loc.labelAr}
                    </option>
                  ))}
                  <option value={CUSTOM_VALUE}>موقع آخر (تحديد يدوي)</option>
                </select>
              </div>
              {originSelect === CUSTOM_VALUE && (
                <input
                  type="text"
                  placeholder="أدخل نقطة الانطلاق..."
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  className="mt-2 w-full min-h-[42px] bg-[#101D2D] border border-[#C9A96B]/25 focus:border-[#C9A96B] rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/70 focus:outline-none"
                />
              )}
            </div>

            {/* Destination + Quick Swap */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="qb-destination" className="block font-label text-[#91B9C8]">
                  الوجهة المقصودة
                </label>
                <button
                  type="button"
                  onClick={handleSwapDirection}
                  aria-label="عكس اتجاه الرحلة"
                  className="inline-flex items-center gap-1 text-[11px] text-[#C9A96B] hover:text-[#DFC89B] transition-colors"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>عكس الاتجاه</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#C9A96B] absolute right-3.5 top-3.5 pointer-events-none" />
                <select
                  id="qb-destination"
                  value={destSelect}
                  onChange={(e) => setDestSelect(e.target.value)}
                  className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/25 focus:border-[#C9A96B] rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white focus:outline-none"
                >
                  {STANDARD_JOURNEY_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.labelAr}>
                      {loc.labelAr}
                    </option>
                  ))}
                  <option value={CUSTOM_VALUE}>وجهة أخرى (تحديد يدوي)</option>
                </select>
              </div>
              {destSelect === CUSTOM_VALUE && (
                <input
                  type="text"
                  placeholder="مثال: الساحل الشمالي / مارينا..."
                  value={customDest}
                  onChange={(e) => setCustomDest(e.target.value)}
                  className="mt-2 w-full min-h-[42px] bg-[#101D2D] border border-[#C9A96B]/25 focus:border-[#C9A96B] rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/70 focus:outline-none"
                />
              )}
            </div>

            {/* Passengers Count */}
            <div className="lg:col-span-2">
              <label htmlFor="qb-passengers" className="block font-label text-[#91B9C8] mb-1.5">
                عدد الركاب
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-[#C9A96B] absolute right-3.5 top-3.5 pointer-events-none" />
                <select
                  id="qb-passengers"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(Number(e.target.value))}
                  className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/25 focus:border-[#C9A96B] rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value={1}>1 راكب</option>
                  <option value={2}>2 ركاب</option>
                  <option value={3}>3 ركاب</option>
                  <option value={4}>4 ركاب (ميني فان)</option>
                  <option value={5}>5 ركاب (ميني فان)</option>
                  <option value={6}>أكثر من 5 ركاب</option>
                </select>
              </div>
            </div>

            {/* Preferred Date */}
            <div className="lg:col-span-2">
              <label htmlFor="qb-date" className="block font-label text-[#91B9C8] mb-1.5">
                تاريخ الرحلة
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#C9A96B] absolute right-3.5 top-3.5 pointer-events-none" />
                <input
                  id="qb-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full min-h-[46px] bg-[#101D2D] border border-[#C9A96B]/25 focus:border-[#C9A96B] rounded-xl pr-10 pl-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Primary CTA */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full min-h-[46px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                <span>احجز رحلتك الآن</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>
            </div>

          </div>

          {livePreview && (
            <div
              className={`pt-2.5 border-t border-[#C9A96B]/15 text-right font-sub flex flex-wrap items-center justify-between gap-2 ${
                livePreview.type === 'error'
                  ? 'text-red-300'
                  : livePreview.type === 'fixed'
                    ? 'text-[#DFC89B]'
                    : 'text-[#91B9C8]'
              }`}
            >
              <span>{livePreview.text}</span>
              <span className="text-[11px] text-[#9A9A96]">
                يتم تخصيص السيارة المناسبة من أسطول الوكيل تلقائياً حسب مسار الرحلة وعدد الركاب
              </span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
