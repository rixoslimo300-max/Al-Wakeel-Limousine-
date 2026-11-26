import React from 'react';
import { Service, PricingRule } from '../types';
import { MapPin, ArrowUpLeft, PhoneCall } from 'lucide-react';
import { RevealBlock, LuxuryTiltCard } from './MotionCard';

import { calculateTripQuote } from '../lib/bookingEngine';

interface DestinationsSectionProps {
  services: Service[];
  pricingRules: PricingRule[];
  onSelectDestination: (origin: string, destination: string) => void;
  onOpenBooking: () => void;
}

interface DestinationItem {
  id: string;
  titleAr: string;
  subtitleAr: string;
  origin: string;
  destination: string;
  serviceId: string;
}

const CORE_DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest-borg',
    titleAr: 'مطار برج العرب الدولي',
    subtitleAr: 'من وإلى الإسكندرية بالاتجاهين بأسعار ثابتة ومتابعة دقيقة لموعد الرحلة.',
    origin: 'الإسكندرية',
    destination: 'مطار برج العرب الدولي',
    serviceId: 'borg-el-arab-airport',
  },
  {
    id: 'dest-cairo',
    titleAr: 'مطار القاهرة الدولي',
    subtitleAr: 'رحلات مباشرة بالاتجاهين بين الإسكندرية ومطار القاهرة الدولي بسيارات مجهزة.',
    origin: 'الإسكندرية',
    destination: 'مطار القاهرة الدولي',
    serviceId: 'cairo-airport',
  },
  {
    id: 'dest-sphinx',
    titleAr: 'مطار سفنكس الدولي',
    subtitleAr: 'انتقالات منظمة بالاتجاهين بين الإسكندرية ومطار سفنكس الدولي بأسعار ثابتة.',
    origin: 'الإسكندرية',
    destination: 'مطار سفنكس الدولي',
    serviceId: 'sphinx-airport',
  },
  {
    id: 'dest-coast',
    titleAr: 'الساحل الشمالي والمدن',
    subtitleAr: 'انتقالات مخصصة إلى مارينا والعلمين الجديدة والمحافظات وفق عرض سعر خاص.',
    origin: 'الإسكندرية',
    destination: 'الساحل الشمالي / مارينا',
    serviceId: 'north-coast',
  },
];

const WHATSAPP_URL = 'https://wa.me/201000053774';

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  pricingRules,
  onSelectDestination,
  onOpenBooking,
}) => {
  const resolveRoutePrice = (origin: string, destination: string) => {
    const sedanQuote = calculateTripQuote({
      origin,
      destination,
      passengersCount: 2,
      serviceCategory: 'sedan_comfort',
      pricingRules,
    });
    return sedanQuote.fixedPrice;
  };

  return (
    <>
      {/* Core Destinations & Service Areas */}
      <section className="section-shell bg-[#152438]/60 border-t border-[#C9A96B]/15 text-[#F6F5F1]" id="destinations">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div className="space-y-2 max-w-2xl text-right">
              <div className="flex items-center gap-2 text-[#C9A96B] font-label">
                <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
                <span>نطاق التغطية والمسارات</span>
              </div>
              <h2 className="font-section-heading text-white">
                وجهات التشغيل الرئيسية
              </h2>
              <p className="font-body text-[#9A9A96]">
                تنسيق مباشر من الإسكندرية إلى المطارات الدولية والوجهات الساحلية والمحافظات.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CORE_DESTINATIONS.map((dest, idx) => {
              const referencePrice = resolveRoutePrice(dest.origin, dest.destination);
              return (
                <RevealBlock key={dest.id} delayMs={idx * 60} className="h-full">
                  <LuxuryTiltCard
                    enableTilt={false}
                    className="h-full bg-[#101D2D] border border-[#C9A96B]/20 hover:border-[#C9A96B]/60 rounded-2xl p-5 flex flex-col justify-between gap-4 text-right"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#152438] border border-[#C9A96B]/25 flex items-center justify-center text-[#C9A96B] shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        {referencePrice !== null ? (
                          <span className="font-label text-[#C9A96B] tabular-nums">
                            يبدأ من {referencePrice.toLocaleString('en-US')} ج.م
                          </span>
                        ) : (
                          <span className="font-label text-[#91B9C8]">
                            عرض سعر خاص
                          </span>
                        )}
                      </div>

                      <h3 className="font-card-heading text-white">{dest.titleAr}</h3>
                      <p className="font-sub text-[#9A9A96]">{dest.subtitleAr}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectDestination(dest.origin, dest.destination)}
                      className="w-full min-h-[42px] pt-3 border-t border-[#C9A96B]/15 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#C9A96B] hover:text-[#DFC89B] transition-colors"
                    >
                      <span>احجز هذه الوجهة</span>
                      <ArrowUpLeft className="w-4 h-4 shrink-0" />
                    </button>
                  </LuxuryTiltCard>
                </RevealBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section id="final-booking" className="section-shell bg-[#101D2D] border-t border-[#C9A96B]/15 text-[#F6F5F1]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealBlock>
            <div className="bg-[#152438] border border-[#C9A96B]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
              <div className="space-y-3 max-w-2xl text-right">
                <div className="flex items-center gap-2 text-[#C9A96B] font-label">
                  <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
                  <span>مكتب الحجز والتنسيق التنفيذي</span>
                </div>
                <h2 className="font-section-heading text-white">
                  وجهتك القادمة تبدأ بتجربة مختلفة.
                </h2>
                <p className="font-body text-[#9A9A96]">
                  اختر رحلتك ودعنا نهتم بتفاصيل انتقالك. تأكيد هاتفي مباشر للسعر والموعد دون الحاجة لدفع إلكتروني مسبق.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-[240px]">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base shadow-lg shadow-black/25 transition-all active:scale-[0.98]"
                >
                  احجز رحلتك الآن
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#101D2D] hover:bg-[#0B1522] border border-[#C9A96B]/35 text-[#F6F5F1] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#C9A96B] shrink-0" aria-hidden="true">
                    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5.016l-1.406 5.141 5.266-1.375c1.484.813 3.141 1.234 4.766 1.234 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406.016.578.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.531-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.5.125.688-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.891.891 2.219 1.047.328.156.547.234.625.359.078.125.078.734-.172 1.438z" />
                  </svg>
                  <span>تواصل معنا عبر واتساب</span>
                </a>
                <a
                  href="tel:+201000053774"
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl text-[#91B9C8] hover:text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                  <span dir="ltr" className="font-latin tabular-nums">+201000053774</span>
                </a>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>
    </>
  );
};
