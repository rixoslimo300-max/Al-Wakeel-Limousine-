import React from 'react';
import { Clock, MapPin, Navigation, ArrowUpLeft, PhoneCall } from 'lucide-react';
import { RevealBlock, LuxuryTiltCard } from './MotionCard';
import {
  DAILY_RENTAL_HEADING_AR,
  DAILY_RENTAL_INTRO_AR,
  DAILY_RENTAL_PACKAGES,
  DailyRentalPackageId,
  OFFICIAL_TEL_HREF,
  OFFICIAL_WHATSAPP_BASE_URL,
  OFFICIAL_WHATSAPP_NUMBER,
} from '../lib/bookingEngine';

interface DailyRentalSectionProps {
  onSelectPackage: (packageId: DailyRentalPackageId) => void;
}

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5.016l-1.406 5.141 5.266-1.375c1.484.813 3.141 1.234 4.766 1.234 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406.016.578.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.531-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.5.125.688-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.891.891 2.219 1.047.328.156.547.234.625.359.078.125.078.734-.172 1.438z" />
  </svg>
);

export const DailyRentalSection: React.FC<DailyRentalSectionProps> = ({
  onSelectPackage,
}) => {
  return (
    <section
      id="daily-rental"
      className="section-shell bg-[#101D2D] text-[#F6F5F1] border-t border-[#C9A96B]/20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">

        {/* Section 2 Heading: Daily Car Rental – Alexandria */}
        <div className="max-w-3xl space-y-2.5 text-right">
          <div className="flex items-center gap-2 text-[#C9A96B] font-label">
            <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
            <span>التأجير اليومي داخل الإسكندرية · Daily Car Rental – Alexandria</span>
          </div>
          <h2 className="font-section-heading text-white">
            {DAILY_RENTAL_HEADING_AR}
          </h2>
          <p className="font-body text-[#9A9A96] leading-relaxed">
            {DAILY_RENTAL_INTRO_AR}
          </p>
        </div>

        {/* Two Exclusive Daily Rental Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {DAILY_RENTAL_PACKAGES.map((pkg, idx) => (
            <RevealBlock key={pkg.id} delayMs={idx * 75} className="h-full">
              <LuxuryTiltCard
                enableTilt={false}
                className="h-full bg-[#152438] border border-[#C9A96B]/30 hover:border-[#C9A96B]/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 text-right"
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4 border-b border-[#C9A96B]/20 pb-4">
                    <div className="space-y-1">
                      <span
                        dir="ltr"
                        className="font-latin text-xs font-semibold tracking-[0.12em] uppercase text-[#C9A96B] block"
                      >
                        {pkg.titleEn}
                      </span>
                      <h3 className="font-section-heading text-white leading-snug">
                        {pkg.titleAr}
                      </h3>
                    </div>

                    <div className="text-left shrink-0">
                      <p className="text-xl sm:text-2xl font-bold text-[#C9A96B] tabular-nums leading-tight">
                        {pkg.priceEgp.toLocaleString('en-US')}
                      </p>
                      <p className="font-label text-[#91B9C8]">جنيه مصري</p>
                    </div>
                  </div>

                  {/* Verified Package Boundaries Only */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1">
                    <div className="bg-[#101D2D] border border-[#C9A96B]/20 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-label text-[#91B9C8]">
                        <Clock className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                        <span>مدة الاستخدام</span>
                      </div>
                      <p className="font-subheading text-white tabular-nums">{pkg.durationLabelAr}</p>
                    </div>

                    <div className="bg-[#101D2D] border border-[#C9A96B]/20 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-label text-[#91B9C8]">
                        <Navigation className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                        <span>المسافة المسموحة</span>
                      </div>
                      <p className="font-subheading text-white tabular-nums">{pkg.distanceLabelAr}</p>
                    </div>

                    <div className="bg-[#101D2D] border border-[#C9A96B]/20 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-label text-[#91B9C8]">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                        <span>نطاق الخدمة</span>
                      </div>
                      <p className="font-subheading text-white">{pkg.scopeLabelAr}</p>
                    </div>
                  </div>

                  <p className="font-body text-[#9A9A96] leading-relaxed">
                    {pkg.descriptionAr}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectPackage(pkg.id)}
                    className="w-full min-h-[48px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold py-3 px-5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                  >
                    <span>
                      {pkg.id === 'daily-rental-8h' ? 'اختار باقة 8 ساعات' : 'اختار باقة 12 ساعة'}
                    </span>
                    <ArrowUpLeft className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </LuxuryTiltCard>
            </RevealBlock>
          ))}
        </div>

        {/* Direct Inquiry Strip for Operational Details Not Pre-Specified */}
        <div className="bg-[#152438]/70 border border-[#C9A96B]/20 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-right">
          <p className="font-sub text-[#F6F5F1]/90 leading-relaxed max-w-2xl">
            تأجير السيارة اليومي مخصص لمشاويرك داخل الإسكندرية، بحدود واضحة للمدة والمسافة. اختار الباقة الأقرب لجدولك، ولو عندك تفاصيل خاصة راجعها مع مكتب الحجز قبل بدء الاستخدام.
          </p>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={OFFICIAL_WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#101D2D] hover:bg-[#C9A96B] hover:text-[#101D2D] border border-[#C9A96B]/30 text-[#C9A96B] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <WhatsAppGlyph className="w-4 h-4 shrink-0" />
              <span>استفسار عبر واتساب</span>
            </a>
            <a
              href={OFFICIAL_TEL_HREF}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#101D2D] border border-[#C9A96B]/25 text-[#F6F5F1] text-sm font-medium inline-flex items-center gap-2 hover:border-[#C9A96B]/60 transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 text-[#C9A96B] shrink-0" />
              <span dir="ltr" className="font-latin tabular-nums">{OFFICIAL_WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
