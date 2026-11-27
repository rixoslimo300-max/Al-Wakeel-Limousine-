import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  Copy,
  Users,
  Briefcase,
  ShieldCheck,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeftRight,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';
import { PricingRule, ServiceCategoryKey } from '../types';
import {
  OFFICIAL_ROUTE_PRICING,
  OFFICIAL_TEL_HREF,
  OFFICIAL_WHATSAPP_BASE_URL,
  OFFICIAL_WHATSAPP_NUMBER,
  QUOTE_REVIEW_MESSAGE_AR,
  calculateTripQuote,
  extractStructuredRouteRules,
} from '../lib/bookingEngine';
import {
  ORDERED_SERVICE_CATEGORY_SPECS,
  SERVICE_CATEGORIES_CONTENT,
  SERVICE_CATEGORY_ALLOCATION_NOTICE_AR,
  SERVICE_CATEGORY_CARD_DISCLAIMER_AR,
} from '../data/serviceCategoriesContent';
import {
  ServiceCategorySlug,
  getServiceCategoryPath,
} from '../data/seoCatalog';
import { shareServiceCategory } from '../lib/seoAndShare';

interface ServiceCategoryPageProps {
  slug: ServiceCategorySlug;
  pricingRules: PricingRule[];
  onNavigateHome: () => void;
  onNavigateCategory: (slug: ServiceCategorySlug) => void;
  onBookCategory: (category: ServiceCategoryKey, presetRoute?: { origin: string; destination: string }) => void;
}

const AIRPORT_ROUTES = [
  {
    id: 'borg-el-arab',
    origin: 'الإسكندرية',
    destination: 'مطار برج العرب الدولي',
    titleAr: 'الإسكندرية ↔ مطار برج العرب الدولي',
  },
  {
    id: 'cairo',
    origin: 'الإسكندرية',
    destination: 'مطار القاهرة الدولي',
    titleAr: 'الإسكندرية ↔ مطار القاهرة الدولي',
  },
  {
    id: 'sphinx',
    origin: 'الإسكندرية',
    destination: 'مطار سفنكس الدولي',
    titleAr: 'الإسكندرية ↔ مطار سفنكس الدولي',
  },
];

export const ServiceCategoryPage: React.FC<ServiceCategoryPageProps> = ({
  slug,
  pricingRules,
  onNavigateHome,
  onNavigateCategory,
  onBookCategory,
}) => {
  const spec = SERVICE_CATEGORIES_CONTENT[slug];
  const [activeShotIdx, setActiveShotIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    setActiveShotIdx(0);
    setLightboxOpen(false);
    setShareFeedback(null);
  }, [slug]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
        setActiveShotIdx((prev) => (prev + 1) % spec.galleryShots.length);
      }
      if (e.key === 'ArrowRight') {
        setActiveShotIdx((prev) => (prev - 1 + spec.galleryShots.length) % spec.galleryShots.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, spec.galleryShots.length]);

  const effectiveRules = extractStructuredRouteRules(
    pricingRules.length ? pricingRules : OFFICIAL_ROUTE_PRICING
  );

  const activeShot = spec.galleryShots[activeShotIdx] || spec.galleryShots[0];
  const otherCategories = ORDERED_SERVICE_CATEGORY_SPECS.filter((c) => c.slug !== slug);

  const handleShare = async () => {
    const result = await shareServiceCategory(slug);
    if (result.status === 'shared') {
      setShareFeedback('تمت مشاركة رابط الفئة');
    } else if (result.status === 'copied') {
      setShareFeedback('تم نسخ رابط الفئة المباشر');
    } else if (result.status === 'failed') {
      setShareFeedback(`رابط المشاركة: ${result.url}`);
    }
    if (result.status !== 'cancelled') {
      window.setTimeout(() => setShareFeedback(null), 4000);
    }
  };

  const resolveRoutePrice = (origin: string, destination: string) => {
    const paxForQuote = spec.categoryKey === 'mini_van' ? 7 : 2;
    const quote = calculateTripQuote({
      origin,
      destination,
      passengersCount: paxForQuote,
      luggageCount: 0,
      serviceCategory: spec.categoryKey,
      pricingRules: effectiveRules,
    });
    return quote.fixedPrice;
  };

  return (
    <main className="bg-[#101D2D] text-[#F6F5F1] min-h-screen pb-14">
      {/* Top Breadcrumb & Direct Share Bar */}
      <div className="bg-[#0B1522]/85 border-b border-[#C9A96B]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs sm:text-sm text-[#9A9A96] min-w-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
              className="inline-flex items-center gap-1.5 text-[#DFC89B] hover:text-white font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرئيسية</span>
            </a>
            <span aria-hidden="true">/</span>
            <span className="truncate text-[#F6F5F1]">فئة {spec.titleAr}</span>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            {shareFeedback && (
              <span role="status" className="text-xs text-[#DFC89B] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                <span>{shareFeedback}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#152438] hover:bg-[#1D3048] border border-[#C9A96B]/30 text-xs sm:text-sm text-[#F6F5F1] font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 text-[#C9A96B] shrink-0" />
              <span>مشاركة الفئة</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Category Hero Section */}
      <section className="border-b border-[#C9A96B]/15 bg-gradient-to-b from-[#0E1A29] to-[#101D2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            <div className="lg:col-span-6 lg:order-2">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0B1522] border border-[#C9A96B]/25 shadow-2xl shadow-black/40">
                <img
                  src={spec.heroImageUrl}
                  alt={spec.heroImageAltAr}
                  width={1000}
                  height={558}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B1522]/70 to-transparent pointer-events-none"
                />
              </div>
              <p className="mt-2.5 text-[11px] sm:text-xs text-[#9A9A96] leading-relaxed text-right">
                {SERVICE_CATEGORY_CARD_DISCLAIMER_AR}
              </p>
            </div>

            <div className="lg:col-span-6 lg:order-1 space-y-5 text-right">
              <div className="flex items-center gap-2 text-[#C9A96B] font-label">
                <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
                <span>{spec.heroEyebrowAr}</span>
              </div>

              <h1 className="font-hero text-white leading-tight">
                {spec.heroTitleAr}
              </h1>

              <p className="font-body text-[#F6F5F1]/88 leading-relaxed max-w-2xl">
                {spec.heroSubtitleAr}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 border-y border-[#C9A96B]/20 text-xs sm:text-sm text-[#DFC89B] tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>{spec.capacitySummaryAr}</span>
                </span>
                <span className="text-[#C9A96B]/40" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>{spec.luggageSummaryAr}</span>
                </span>
                <span className="text-[#C9A96B]/40" aria-hidden="true">·</span>
                <span className="text-[#91B9C8]">{spec.pricingHeadlineAr}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onBookCategory(spec.categoryKey)}
                  className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>احجز هذه الفئة</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-[#152438] hover:bg-[#1C2F48] border border-[#C9A96B]/30 text-[#F6F5F1] font-medium text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Copy className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>مشاركة الفئة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Original Category Editorial Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-[#C9A96B]/15">
        <div className="max-w-3xl space-y-2 mb-7 text-right">
          <p className="font-label text-[#C9A96B]">اختيار الفئة يبدأ من احتياج رحلتك</p>
          <h2 className="font-section-heading text-white">
            كيف تساعدك فئة {spec.titleAr} في ترتيب انتقالك؟
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-right">
          <article className="bg-[#152438]/75 border border-[#C9A96B]/20 rounded-2xl p-5 space-y-2">
            <h3 className="font-subheading text-[#DFC89B]">ما الذي يميزها؟</h3>
            <p className="font-sub text-[#F6F5F1]/85 leading-relaxed">{spec.editorialIntro.natureAr}</p>
          </article>
          <article className="bg-[#152438]/75 border border-[#C9A96B]/20 rounded-2xl p-5 space-y-2">
            <h3 className="font-subheading text-[#DFC89B]">هل تناسب عددكم؟</h3>
            <p className="font-sub text-[#F6F5F1]/85 leading-relaxed">{spec.editorialIntro.audienceAr}</p>
          </article>
          <article className="bg-[#152438]/75 border border-[#C9A96B]/20 rounded-2xl p-5 space-y-2">
            <h3 className="font-subheading text-[#DFC89B]">أين تستخدمها؟</h3>
            <p className="font-sub text-[#F6F5F1]/85 leading-relaxed">{spec.editorialIntro.tripTypesAr}</p>
          </article>
          <article className="bg-[#152438]/75 border border-[#C9A96B]/20 rounded-2xl p-5 space-y-2">
            <h3 className="font-subheading text-[#DFC89B]">ماذا تكسب من اختيارها؟</h3>
            <p className="font-sub text-[#F6F5F1]/85 leading-relaxed">{spec.editorialIntro.customerValueAr}</p>
          </article>
        </div>
      </section>

      {/* 3. Multi-Image Experience Gallery (Lazy-loaded details + Lightbox) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-[#C9A96B]/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 text-right">
          <div className="space-y-1.5">
            <p className="font-label text-[#C9A96B]">معرض التجربة والرحابة</p>
            <h2 className="font-section-heading text-white">
              تجربة السفر والرحابة في فئة {spec.titleAr}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="self-start sm:self-end min-h-[42px] px-4 py-2 rounded-xl bg-[#152438] hover:bg-[#1C2F48] border border-[#C9A96B]/30 text-xs sm:text-sm text-[#DFC89B] inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Maximize2 className="w-4 h-4 text-[#C9A96B] shrink-0" />
            <span>عرض بالحجم الكامل</span>
          </button>
        </div>

        <div className="bg-[#152438]/60 border border-[#C9A96B]/25 rounded-2xl p-3.5 sm:p-5 space-y-4">
          <div className="relative bg-[#0B1522] rounded-xl overflow-hidden border border-[#C9A96B]/15">
            <div className="w-full max-w-4xl mx-auto aspect-[4/3] sm:max-h-[460px] flex items-center justify-center">
              <img
                src={activeShot.imageUrl}
                alt={activeShot.altAr}
                width={activeShot.width}
                height={activeShot.height}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveShotIdx(
                  (prev) => (prev - 1 + spec.galleryShots.length) % spec.galleryShots.length
                )
              }
              aria-label="الصورة السابقة"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101D2D]/85 hover:bg-[#C9A96B] text-white hover:text-[#101D2D] border border-[#C9A96B]/35 flex items-center justify-center transition-colors shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveShotIdx((prev) => (prev + 1) % spec.galleryShots.length)
              }
              aria-label="الصورة التالية"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101D2D]/85 hover:bg-[#C9A96B] text-white hover:text-[#101D2D] border border-[#C9A96B]/35 flex items-center justify-center transition-colors shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {(activeShot.titleAr || activeShot.captionAr) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-right">
              {activeShot.titleAr && (
                <span className="font-label text-[#DFC89B]">{activeShot.titleAr}</span>
              )}
              {activeShot.captionAr && (
                <p className="font-sub text-[#9A9A96]">{activeShot.captionAr}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3" role="tablist" aria-label={`معرض صور فئة ${spec.titleAr}`}>
            {spec.galleryShots.map((shot, idx) => {
              const isSelected = idx === activeShotIdx;
              return (
                <button
                  key={shot.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={shot.titleAr || shot.altAr}
                  onClick={() => setActiveShotIdx(idx)}
                  className={`rounded-xl overflow-hidden border transition-all bg-[#0B1522] ${
                    isSelected
                      ? 'border-[#C9A96B] ring-2 ring-[#C9A96B]/40'
                      : 'border-[#C9A96B]/20 opacity-75 hover:opacity-100 hover:border-[#C9A96B]/55'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={shot.imageUrl}
                      alt={shot.altAr}
                      width={shot.width}
                      height={shot.height}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Experience Benefits + 5. Capacity & 6. Pricing + 7. Allocation Disclosure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-[#C9A96B]/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
          <div className="lg:col-span-7 space-y-5 text-right">
            <div className="space-y-1.5">
              <p className="font-label text-[#C9A96B]">تفاصيل تصنع فرقًا في رحلتك</p>
              <h2 className="font-section-heading text-white">
                قيمة فئة {spec.titleAr} في كل مرحلة من الرحلة
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spec.experienceBenefits.map((benefit) => (
                <div
                  key={benefit.titleAr}
                  className="bg-[#152438]/75 border border-[#C9A96B]/20 rounded-2xl p-5 space-y-2"
                >
                  <h3 className="font-subheading text-white">{benefit.titleAr}</h3>
                  <p className="font-sub text-[#9A9A96] leading-relaxed">{benefit.detailAr}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 text-right">
            {/* Capacity & Allocation Rules */}
            <div className="bg-[#152438] border border-[#C9A96B]/30 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#C9A96B] font-label">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>معلومات السعة والأهلية المعتمدة</span>
              </div>

              <div className="space-y-2.5 text-sm border-y border-[#C9A96B]/20 py-3.5 tabular-nums">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#91B9C8]">سعة الركاب:</span>
                  <span className="font-bold text-white">{spec.capacitySummaryAr}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#91B9C8]">سعة الحقائب:</span>
                  <span className="font-bold text-white">{spec.luggageSummaryAr}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#91B9C8]">آلية التخصيص:</span>
                  <span className="font-medium text-[#DFC89B]">{spec.allocationModeLabelAr}</span>
                </div>
              </div>

              <p className="font-sub text-[#F6F5F1]/85 leading-relaxed">
                {spec.capacityRuleSummaryAr}
              </p>

              {/* Pricing Rules */}
              <div className="pt-2 space-y-3">
                <h3 className="font-subheading text-white">التسعير المعتمد</h3>
                {spec.supportsAirportFixedPricing ? (
                  <div className="divide-y divide-[#C9A96B]/15 border border-[#C9A96B]/20 rounded-xl overflow-hidden bg-[#101D2D]/70">
                    {AIRPORT_ROUTES.map((route) => {
                      const price = resolveRoutePrice(route.origin, route.destination);
                      return (
                        <button
                          key={route.id}
                          type="button"
                          onClick={() =>
                            onBookCategory(spec.categoryKey, {
                              origin: route.origin,
                              destination: route.destination,
                            })
                          }
                          className="w-full px-4 py-3 hover:bg-[#152438] transition-colors flex items-center justify-between gap-3 text-right"
                        >
                          <span className="text-xs sm:text-sm text-[#F6F5F1] flex items-center gap-2">
                            <ArrowLeftRight className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                            <span>{route.titleAr}</span>
                          </span>
                          <span className="font-bold text-[#C9A96B] text-sm tabular-nums whitespace-nowrap">
                            {price !== null
                              ? `${price.toLocaleString('en-US')} ج.م`
                              : QUOTE_REVIEW_MESSAGE_AR}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#101D2D]/85 border border-[#C9A96B]/25 rounded-xl p-4 space-y-1.5">
                    <p className="font-bold text-[#DFC89B] text-sm">{QUOTE_REVIEW_MESSAGE_AR}</p>
                    <p className="font-sub text-[#9A9A96] leading-relaxed">
                      يتم مراجعة مسار وتوقيت الرحلة وتأكيد السعر النهائي معك قبل تنفيذ الطلب دون أي دفع إلكتروني مسبق.
                    </p>
                  </div>
                )}
              </div>

              {/* Mandatory Vehicle Allocation Disclosure */}
              <div className="bg-[#0B1522]/85 border border-[#C9A96B]/20 rounded-xl p-4">
                <p className="font-sub text-[#91B9C8] leading-relaxed">
                  {SERVICE_CATEGORY_ALLOCATION_NOTICE_AR}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onBookCategory(spec.categoryKey)}
                className="w-full min-h-[48px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold py-3 px-5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                <span>احجز هذه الفئة</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GEO / Answer Engine Questions & Answers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-[#C9A96B]/15">
        <div className="max-w-3xl space-y-2 mb-6 text-right">
          <div className="flex items-center gap-2 text-[#C9A96B] font-label">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>إجابات تساعدك تختار الفئة المناسبة</span>
          </div>
          <h2 className="font-section-heading text-white">
            أسئلة عن حجز فئة {spec.titleAr}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-right">
          {spec.geoFaqItems.map((qa) => (
            <article
              key={qa.questionAr}
              className="bg-[#152438]/70 border border-[#C9A96B]/20 rounded-2xl p-5 space-y-2.5"
            >
              <h3 className="font-subheading text-white leading-snug">{qa.questionAr}</h3>
              <p className="font-sub text-[#9A9A96] leading-relaxed">{qa.answerAr}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Explore Other Service Categories + Final Contact & Booking CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="space-y-4 text-right">
          <h2 className="font-subheading text-white">استكشف باقي فئات الخدمة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCategories.map((other) => (
              <a
                key={other.slug}
                href={getServiceCategoryPath(other.slug)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCategory(other.slug);
                }}
                className="group bg-[#152438]/80 hover:bg-[#152438] border border-[#C9A96B]/20 hover:border-[#C9A96B]/60 rounded-2xl p-4 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-card-heading text-white group-hover:text-[#DFC89B] truncate">
                    {other.titleAr}
                  </p>
                  <p className="text-xs text-[#91B9C8] truncate tabular-nums">
                    {other.capacitySummaryAr}
                  </p>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#C9A96B] shrink-0" />
              </a>
            ))}
          </div>
        </div>

        <div className="bg-[#152438] border border-[#C9A96B]/30 rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 text-right">
          <div className="space-y-1.5">
            <h2 className="font-section-heading text-white">جاهز لحجز فئة {spec.titleAr}؟</h2>
            <p className="font-sub text-[#9A9A96]">
              ابدأ حجزك بهذه الفئة الآن مع الاحتفاظ بأي تفاصيل رحلة قمت بإدخالها مسبقًا.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onBookCategory(spec.categoryKey)}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base inline-flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <span>احجز هذه الفئة</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </button>
            <a
              href={OFFICIAL_WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-3 rounded-xl bg-[#101D2D] border border-[#C9A96B]/30 text-sm font-medium text-[#F6F5F1] hover:border-[#C9A96B] inline-flex items-center whitespace-nowrap"
            >
              تواصل واتساب
            </a>
            <a
              href={OFFICIAL_TEL_HREF}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-[#101D2D] border border-[#C9A96B]/20 text-xs sm:text-sm text-[#91B9C8] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap"
              dir="ltr"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
              <span className="font-latin tabular-nums">{OFFICIAL_WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal (only mounts when expanded by user) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#070E17]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`معرض فئة ${spec.titleAr}`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="w-full max-w-5xl bg-[#101D2D] border border-[#C9A96B]/35 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A96B]/20 bg-[#0B1522]">
              <span className="text-sm font-semibold text-[#DFC89B]">
                {activeShot.titleAr
                  ? `فئة ${spec.titleAr} · ${activeShot.titleAr}`
                  : `فئة ${spec.titleAr}`}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="إغلاق المعرض"
                className="w-9 h-9 rounded-lg bg-[#152438] text-white flex items-center justify-center hover:bg-[#1D3048]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative bg-[#070E17] flex items-center justify-center p-2 sm:p-4">
              <img
                src={activeShot.imageUrl}
                alt={activeShot.altAr}
                width={activeShot.width}
                height={activeShot.height}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() =>
                  setActiveShotIdx(
                    (prev) => (prev - 1 + spec.galleryShots.length) % spec.galleryShots.length
                  )
                }
                aria-label="الصورة السابقة"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101D2D]/85 hover:bg-[#C9A96B] text-white hover:text-[#101D2D] border border-[#C9A96B]/35 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveShotIdx((prev) => (prev + 1) % spec.galleryShots.length)
                }
                aria-label="الصورة التالية"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101D2D]/85 hover:bg-[#C9A96B] text-white hover:text-[#101D2D] border border-[#C9A96B]/35 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            {activeShot.captionAr && (
              <div className="px-4 py-3 border-t border-[#C9A96B]/15 text-xs sm:text-sm text-[#9A9A96] text-right">
                {activeShot.captionAr}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
