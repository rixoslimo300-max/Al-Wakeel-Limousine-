import React, { useState } from 'react';
import { Users, Briefcase, Share2, Check } from 'lucide-react';
import { RevealBlock, LuxuryTiltCard } from './MotionCard';
import { ServiceCategoryKey } from '../types';
import {
  ORDERED_SERVICE_CATEGORY_SPECS,
  SERVICE_CATEGORY_CARD_DISCLAIMER_AR,
  ServiceCategoryMarketingSpec,
} from '../data/serviceCategoriesContent';
import { ServiceCategorySlug, getServiceCategoryPath } from '../data/seoCatalog';
import { shareServiceCategory } from '../lib/seoAndShare';

interface FleetSectionProps {
  onSelectCategory: (category: ServiceCategoryKey | null) => void;
  onOpenCategoryPage: (slug: ServiceCategorySlug) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({
  onSelectCategory,
  onOpenCategoryPage,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<ServiceCategorySlug | null>(null);

  const handleCardShare = async (
    e: React.MouseEvent,
    slug: ServiceCategorySlug
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await shareServiceCategory(slug);
    if (res.status === 'copied' || res.status === 'shared') {
      setCopiedSlug(slug);
      window.setTimeout(() => setCopiedSlug((cur) => (cur === slug ? null : cur)), 2500);
    }
  };

  const renderCategoryCard = (spec: ServiceCategoryMarketingSpec, idx: number) => {
    const categoryHref = getServiceCategoryPath(spec.slug);
    const isShared = copiedSlug === spec.slug;

    return (
      <RevealBlock key={spec.slug} delayMs={Math.min(idx * 60, 180)} className="h-full">
        <LuxuryTiltCard
          enableTilt={true}
          className="relative cursor-pointer h-full bg-[#152438] border border-[#C9A96B]/25 hover:border-[#C9A96B]/75 hover:shadow-xl hover:shadow-black/35 focus-within:ring-2 focus-within:ring-[#C9A96B]/70 rounded-2xl overflow-hidden flex flex-col group transition-all"
        >
          {/* 16:9 Category Visual — Covered by the full-card accessible link */}
          <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#0B1522]">
            <img
              src={spec.heroImageUrl}
              alt={spec.heroImageAltAr}
              width={1000}
              height={558}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#152438] via-[#152438]/15 to-transparent pointer-events-none"
            />
          </div>

          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4 text-right">
            <div className="flex-1 flex flex-col space-y-3.5">
              <div>
                <p className="font-latin text-xs text-[#C9A96B] tracking-wider uppercase" dir="ltr">
                  {spec.titleEn}
                </p>
                {/* Stretched primary link makes the entire card clickable cleanly for mouse, keyboard, and screen readers */}
                <a
                  href={categoryHref}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenCategoryPage(spec.slug);
                  }}
                  aria-label={`فئة ${spec.titleAr} — ${spec.cardHeadlineAr}`}
                  className="inline-block mt-0.5 rounded focus-visible:outline-none after:absolute after:inset-0 after:z-10"
                >
                  <h3 className="font-section-heading text-white leading-snug group-hover:text-[#DFC89B] transition-colors">
                    {spec.titleAr}
                  </h3>
                </a>
                <p className="font-sub text-[#DFC89B]/90 mt-1">{spec.cardHeadlineAr}</p>
              </div>

              <div className="py-2.5 border-y border-[#C9A96B]/20 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#F6F5F1]/90 tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>{spec.capacitySummaryAr}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>{spec.luggageSummaryAr}</span>
                </span>
              </div>

              <p className="font-sub text-[#9A9A96] leading-relaxed">
                {spec.cardSummaryAr}
              </p>

              <p className="text-xs text-[#91B9C8] font-medium tabular-nums">
                {spec.pricingHeadlineAr}
              </p>
            </div>

            {/* Independent Card Actions layered above the stretched card link */}
            <div className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3 border-t border-[#C9A96B]/15">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(spec.categoryKey);
                }}
                className="flex-1 min-h-[46px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm sm:text-base whitespace-nowrap"
              >
                احجز هذه الفئة
              </button>

              <button
                type="button"
                onClick={(e) => handleCardShare(e, spec.slug)}
                aria-label={`مشاركة فئة ${spec.titleAr}`}
                className="min-h-[46px] px-4 rounded-xl bg-[#101D2D] hover:bg-[#192C44] border border-[#C9A96B]/30 hover:border-[#C9A96B]/65 text-[#DFC89B] inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
              >
                {isShared ? (
                  <>
                    <Check className="w-4 h-4 text-[#C9A96B] shrink-0" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#C9A96B] shrink-0" />
                    <span>مشاركة الفئة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </LuxuryTiltCard>
      </RevealBlock>
    );
  };

  return (
    <section
      className="section-shell bg-[#101D2D] text-[#F6F5F1] border-t border-[#C9A96B]/15"
      id="fleet"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-3xl space-y-2.5 text-right">
            <div className="flex items-center gap-2 text-[#C9A96B] font-label">
              <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
              <span>اختيار فئة الليموزين</span>
            </div>
            <h2 className="font-section-heading text-white">
              عدد الركاب والحقائب يحدد الاختيار… مش اسم السيارة
            </h2>
            <p className="font-body text-[#9A9A96] leading-relaxed">
              من ليموزين سيدان للمسافر الفردي إلى فئات بريميوم وميني فان للعائلات والمجموعات، قارن السعة الفعلية للركاب والحقائب واختر مستوى الخدمة المناسب لرحلتك من الإسكندرية إلى المطارات أو الوجهات المتاحة. يظهر السعر المعتمد للمسارات المسعّرة، ويمكنك طلب عرض سعر لغيرها.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
          {ORDERED_SERVICE_CATEGORY_SPECS.map((spec, idx) => renderCategoryCard(spec, idx))}
        </div>

        <div className="bg-[#152438]/70 border border-[#C9A96B]/20 rounded-2xl p-4 sm:p-5 text-right">
          <p className="font-sub text-[#91B9C8] leading-relaxed">
            {SERVICE_CATEGORY_CARD_DISCLAIMER_AR}
          </p>
        </div>
      </div>
    </section>
  );
};
