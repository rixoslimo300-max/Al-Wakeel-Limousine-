import React, { useMemo } from 'react';
import { PricingRule, ServiceCategoryKey } from '../types';
import {
  ArrowUpLeft,
  Clock,
  Receipt,
  ShieldCheck,
  RefreshCw,
  UserCheck,
  PlaneLanding,
  ArrowLeftRight,
} from 'lucide-react';
import { RevealBlock, LuxuryTiltCard } from './MotionCard';
import {
  AIRPORT_TRANSFER_ADVANTAGES,
  OFFICIAL_ROUTE_PRICING,
  OFFICIAL_WHATSAPP_BASE_URL,
  SERVICE_CATEGORIES,
  UNLISTED_ROUTE_QUOTE_MESSAGE_AR,
  calculateTripQuote,
  extractStructuredRouteRules,
} from '../lib/bookingEngine';
import soueastSuvImg from '../assets/images/fleet_soueast_s07.webp';
import elantraBlackImg from '../assets/images/fleet_elantra_cn7.webp';

import {
  ServiceCategorySlug,
  CATEGORY_KEY_TO_SLUG,
  getServiceCategoryPath,
} from '../data/seoCatalog';

export interface AirportTransferSelection {
  origin: string;
  destination: string;
  category: ServiceCategoryKey;
}

interface ServicesSectionProps {
  pricingRules: PricingRule[];
  onSelectTransfer: (selection: AirportTransferSelection) => void;
  onOpenCategoryPage: (slug: ServiceCategorySlug) => void;
}

interface AirportRouteSpec {
  id: string;
  origin: string;
  destination: string;
  routeTitleAr: string;
}

const AIRPORT_ROUTES: AirportRouteSpec[] = [
  {
    id: 'borg-el-arab-airport',
    origin: 'الإسكندرية',
    destination: 'مطار برج العرب الدولي',
    routeTitleAr: 'الإسكندرية ↔ مطار برج العرب الدولي',
  },
  {
    id: 'cairo-airport',
    origin: 'الإسكندرية',
    destination: 'مطار القاهرة الدولي',
    routeTitleAr: 'الإسكندرية ↔ مطار القاهرة الدولي',
  },
  {
    id: 'sphinx-airport',
    origin: 'الإسكندرية',
    destination: 'مطار سفنكس الدولي',
    routeTitleAr: 'الإسكندرية ↔ مطار سفنكس الدولي',
  },
];

const ADVANTAGE_ICONS = [
  PlaneLanding,
  Clock,
  Receipt,
  ShieldCheck,
  RefreshCw,
  UserCheck,
  ArrowUpLeft,
];

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5.016l-1.406 5.141 5.266-1.375c1.484.813 3.141 1.234 4.766 1.234 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406.016.578.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.531-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.5.125.688-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.891.891 2.219 1.047.328.156.547.234.625.359.078.125.078.734-.172 1.438z" />
  </svg>
);

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  pricingRules,
  onSelectTransfer,
  onOpenCategoryPage,
}) => {
  const effectiveRules = useMemo(
    () => extractStructuredRouteRules(pricingRules.length ? pricingRules : OFFICIAL_ROUTE_PRICING),
    [pricingRules]
  );

  const transferCategories: Array<{
    key: 'sedan_comfort' | 'suv_premium';
    image: string;
    alt: string;
    capacityBadge: string;
  }> = [
    {
      key: 'sedan_comfort',
      image: elantraBlackImg,
      alt: 'فئة سيدان مريحة لانتقالات المطارات الخاصة',
      capacityBadge: '1–3 ركاب · حتى حقيبتين',
    },
    {
      key: 'suv_premium',
      image: soueastSuvImg,
      alt: 'فئة بريميوم لانتقالات المطارات الخاصة',
      capacityBadge: 'حتى 4 ركاب بالأمتعة · أو 5–6 بدون حقائب',
    },
  ];

  const resolvePrice = (origin: string, destination: string, category: ServiceCategoryKey) => {
    const result = calculateTripQuote({
      origin,
      destination,
      passengersCount: 2,
      serviceCategory: category,
      pricingRules: effectiveRules,
    });
    return result.fixedPrice;
  };

  return (
    <section
      className="section-shell bg-[#152438] text-[#F6F5F1] border-t border-[#C9A96B]/15"
      id="services"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">

        {/* Section 1 Heading: Airport Transfers */}
        <div className="max-w-3xl space-y-2.5 text-right">
          <div className="flex items-center gap-2 text-[#C9A96B] font-label">
            <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
            <span>انتقالات المطارات · Airport Transfers</span>
          </div>
          <h2 className="font-section-heading text-white">
            قبل موعد الطيران… احسم تفاصيل انتقالك من الإسكندرية
          </h2>
          <p className="font-body text-[#9A9A96] leading-relaxed">
            سواء كانت وجهتك مطار برج العرب أو مطار القاهرة أو مطار سفنكس، أدخل تفاصيل الرحلة واختر الفئة التي تستوعب ركابك وحقائبك. يعرض التطبيق سعر المسارات المعتمدة، ويتيح طلب عرض سعر للمسارات غير المسعّرة قبل إرسال الحجز.
          </p>
        </div>

        {/* Two Approved Airport Transfer Categories: Comfort Sedan & Premium SUV */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {transferCategories.map((item, idx) => {
            const meta = SERVICE_CATEGORIES[item.key];
            const categorySlug = CATEGORY_KEY_TO_SLUG[item.key];
            const categoryPath = getServiceCategoryPath(categorySlug);
            return (
              <RevealBlock key={item.key} delayMs={idx * 70} className="h-full">
                <LuxuryTiltCard
                  enableTilt={false}
                  className="relative cursor-pointer h-full bg-[#101D2D] border border-[#C9A96B]/25 hover:border-[#C9A96B]/70 focus-within:ring-2 focus-within:ring-[#C9A96B]/70 rounded-2xl overflow-hidden flex flex-col group transition-all"
                >
                  {/* Clean 16:9 Category Visual — Covered by the card's accessible stretched link */}
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#0B1522]">
                    <img
                      src={item.image}
                      alt={item.alt}
                      width={960}
                      height={540}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center opacity-95 group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#101D2D] to-transparent pointer-events-none" />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between gap-6 text-right">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            dir="ltr"
                            className="font-latin text-xs font-semibold tracking-[0.14em] uppercase text-[#C9A96B]"
                          >
                            {meta.titleEn}
                          </span>
                          <span className="font-label text-[#91B9C8]">
                            {item.capacityBadge}
                          </span>
                        </div>
                        <a
                          href={categoryPath}
                          onClick={(e) => {
                            e.preventDefault();
                            onOpenCategoryPage(categorySlug);
                          }}
                          className="block group-hover:text-[#DFC89B] transition-colors focus-visible:outline-none after:absolute after:inset-0 after:z-10"
                        >
                          <h3 className="font-section-heading text-white leading-snug group-hover:text-[#DFC89B] transition-colors">
                            {item.key === 'sedan_comfort' ? 'ليموزين سيدان للمطار — انتقال خاص حتى 3 ركاب' : 'فئة بريميوم للمطار — مساحة أوسع للركاب والحقائب'}
                          </h3>
                        </a>
                      </div>

                      <p className="font-body text-[#9A9A96] leading-relaxed">
                        {item.key === 'sedan_comfort' ? 'لرحلة فردية أو مع مرافقين: سيارة خاصة حتى 3 ركاب وحقيبتين، مع إظهار سعر المسار المعتمد قبل إرسال الحجز.' : 'لما تحتاج مساحة أوسع: فئة بريميوم حتى 4 ركاب و4 حقائب، أو 5–6 ركاب دون حقائب، وفق حدود السعة المعتمدة.'}
                      </p>

                      {/* Official Airport Routes & Fixed Prices */}
                      <div className="relative z-20 pt-2 space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#91B9C8] pb-1.5 border-b border-[#C9A96B]/15">
                          <span className="flex items-center gap-1.5 font-medium">
                            <ArrowLeftRight className="w-3.5 h-3.5 text-[#C9A96B]" />
                            <span>المسار المعتمد (ذهاب أو عودة)</span>
                          </span>
                          <span>السعر الثابت</span>
                        </div>

                        <div className="divide-y divide-[#C9A96B]/15">
                          {AIRPORT_ROUTES.map((route) => {
                            const price = resolvePrice(route.origin, route.destination, item.key);
                            return (
                              <button
                                key={route.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectTransfer({
                                    origin: route.origin,
                                    destination: route.destination,
                                    category: item.key,
                                  });
                                }}
                                className="w-full py-3 px-2.5 -mx-2.5 rounded-xl hover:bg-[#152438]/90 transition-colors flex items-center justify-between gap-3 text-right"
                              >
                                <span className="font-sub sm:text-sm text-[#F6F5F1] font-medium">
                                  {route.routeTitleAr}
                                </span>
                                <span className="shrink-0 font-bold text-[#C9A96B] text-sm sm:text-base tabular-nums whitespace-nowrap">
                                  {price !== null ? `${price.toLocaleString('en-US')} جنيه` : 'عرض سعر خاص'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="relative z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransfer({
                            origin: 'الإسكندرية',
                            destination: 'مطار برج العرب الدولي',
                            category: item.key,
                          });
                        }}
                        className="w-full min-h-[48px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold py-3 px-5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                      >
                        <span>احجز انتقال مطار ({meta.titleAr})</span>
                        <ArrowUpLeft className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                </LuxuryTiltCard>
              </RevealBlock>
            );
          })}
        </div>

        {/* Unlisted Route Clear Handling Banner */}
        <div className="bg-[#101D2D] border border-[#C9A96B]/20 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-right">
          <div className="space-y-1">
            <h3 className="font-subheading text-white">وجهتك مختلفة عن المسارات المعروضة؟</h3>
            <p className="font-sub text-[#9A9A96]">
              لأي مسار غير مدرج أو انتقال خاص بين المحافظات، أرسل تفاصيل نقطة التحرك والوجهة والموعد لتحصل على عرض سعر قبل تأكيد الرحلة.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                onSelectTransfer({
                  origin: 'الإسكندرية',
                  destination: 'الساحل الشمالي / مارينا',
                  category: 'sedan_comfort',
                })
              }
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#152438] hover:bg-[#1c2f48] border border-[#C9A96B]/35 text-[#F6F5F1] text-sm font-medium transition-colors whitespace-nowrap"
            >
              طلب عرض سعر لمسار آخر
            </button>
            <a
              href={OFFICIAL_WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#152438] hover:bg-[#C9A96B] hover:text-[#101D2D] border border-[#C9A96B]/30 text-[#C9A96B] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <WhatsAppGlyph className="w-4 h-4 shrink-0" />
              <span>تواصل عبر واتساب</span>
            </a>
          </div>
        </div>

        {/* Dedicated Airport-Only Advantages Block */}
        <div className="pt-4 border-t border-[#C9A96B]/20 space-y-6">
          <div className="space-y-1.5 text-right">
            <h3 className="font-subheading text-white">تفاصيل تجعل ترتيب انتقال المطار أوضح من البداية</h3>
            <p className="font-sub text-[#91B9C8]">
              راجع ما تتضمنه خدمة انتقالات المطارات قبل اختيار المسار وإرسال الحجز.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {AIRPORT_TRANSFER_ADVANTAGES.map((advantage, index) => {
              const Icon = ADVANTAGE_ICONS[index] || ShieldCheck;
              const isSeventh = index === AIRPORT_TRANSFER_ADVANTAGES.length - 1;
              return (
                <div
                  key={index}
                  className={`bg-[#101D2D]/85 border border-[#C9A96B]/20 rounded-xl p-4 flex items-start gap-3 text-right ${
                    isSeventh ? 'sm:col-span-2 lg:col-span-3' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#152438] border border-[#C9A96B]/25 flex items-center justify-center text-[#C9A96B] shrink-0">
                    {index === AIRPORT_TRANSFER_ADVANTAGES.length - 1 ? (
                      <WhatsAppGlyph className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <p className="font-sub text-[#F6F5F1] leading-relaxed pt-0.5">{advantage}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
