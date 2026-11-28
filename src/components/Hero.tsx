import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import heroSuvImg from '../assets/images/hero_soueast_s07.webp';
import heroSuvSmImg from '../assets/images/hero_soueast_s07_sm.webp';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigateServices }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Subtle GPU-composited desktop scroll parallax
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (imageRef.current) {
          const offset = Math.min(window.scrollY * 0.08, 32);
          imageRef.current.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.03)`;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative bg-[#101D2D] text-[#F6F5F1] overflow-hidden">

      {/* MOBILE & TABLET COMPOSITION (< lg): Vehicle commands top frame unobstructed, copy sits cleanly below */}
      <div className="lg:hidden">
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0B1522]">
          <picture>
            <source media="(max-width: 1023px)" srcSet={heroSuvSmImg} />
            <img
              src={heroSuvImg}
              alt="سيارة تمثيلية فاخرة لفئة بريميوم أمام المطار عند الغروب"
              width={800}
              height={500}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={`w-full h-full object-cover object-[66%_52%] sm:object-[62%_50%] transition-all duration-700 ease-out ${
                heroReady ? 'opacity-100 scale-100' : 'opacity-90 scale-[1.03]'
              }`}
            />
          </picture>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#101D2D] via-[#101D2D]/45 to-transparent"
          />
        </div>

        <div className="max-w-3xl mx-auto px-5 pt-3 pb-8 sm:px-6 sm:pt-4 sm:pb-10 text-right space-y-4">
          <div className="flex items-center gap-2.5 text-[#C9A96B] font-label">
            <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
            <span>الوكيل لخدمات الليموزين</span>
          </div>

          <h1 className="font-hero text-white">
            تنقّل يليق بوجهتك.
          </h1>

          <p className="font-body text-[#F6F5F1]/85 max-w-xl">
            خدمات ليموزين خاصة من الإسكندرية إلى مطارات برج العرب والقاهرة وسفنكس، وإلى الساحل الشمالي ووجهات أخرى حسب الطلب. اختر فئة الخدمة وفق عدد الركاب والحقائب، وراجع السعر المعتمد أو اطلب عرض سعر قبل إرسال الحجز.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full sm:w-auto min-h-[48px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold px-6 py-3 rounded-xl shadow-lg shadow-black/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base animate-pulse-gold"
            >
              <span>احجز رحلتك الآن</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onNavigateServices}
              className="w-full sm:w-auto min-h-[48px] bg-[#152438] hover:bg-[#1c2f48] text-[#F6F5F1] border border-[#C9A96B]/35 hover:border-[#C9A96B]/70 px-6 py-3 rounded-xl font-medium transition-colors text-sm sm:text-base"
            >
              قارن فئات الخدمة
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP CINEMATIC COMPOSITION (lg+): Car dominates right/center 65-75%, text sits cleanly on physical left */}
      <div className="hidden lg:flex relative min-h-[78vh] max-h-[820px] items-center">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B1522]">
          <img
            ref={imageRef}
            src={heroSuvImg}
            alt="سيارة تمثيلية فاخرة لفئة بريميوم أمام صالة المطار عند الغروب"
            width={1440}
            height={900}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className={`w-full h-full object-cover object-[72%_54%] transition-opacity duration-700 ease-out will-change-transform ${
              heroReady ? 'opacity-100' : 'opacity-85'
            }`}
            style={{ transform: 'translate3d(0, 0, 0) scale(1.03)' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#101D2D]/95 via-[#101D2D]/55 via-35% to-transparent to-62%"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#101D2D] via-[#101D2D]/40 to-transparent"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 py-20 flex justify-end">
          <div
            className={`w-full max-w-[430px] xl:max-w-[465px] text-right space-y-5 transition-all duration-700 ease-out ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="flex items-center gap-2.5 text-[#C9A96B] font-label">
              <span className="w-6 h-px bg-[#C9A96B]/75 shrink-0" aria-hidden="true" />
              <span>الوكيل لخدمات الليموزين</span>
                </div>

            <h1 className="font-hero text-white">
              تنقّل يليق بوجهتك.
            </h1>

            <p className="font-body text-[#F6F5F1]/90 leading-relaxed">
              خدمات ليموزين خاصة من الإسكندرية إلى مطارات برج العرب والقاهرة وسفنكس، وإلى الساحل الشمالي ووجهات أخرى حسب الطلب. اختر فئة الخدمة وفق عدد الركاب والحقائب، وراجع السعر المعتمد أو اطلب عرض سعر قبل إرسال الحجز.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="min-h-[48px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold px-6 py-3 rounded-xl shadow-xl shadow-black/30 transition-all active:scale-[0.98] flex items-center gap-2 text-sm xl:text-base whitespace-nowrap"
              >
                <span>احجز رحلتك الآن</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={onNavigateServices}
                className="min-h-[48px] bg-[#101D2D]/80 backdrop-blur-sm hover:bg-[#152438] text-[#F6F5F1] border border-[#C9A96B]/40 hover:border-[#C9A96B]/80 px-6 py-3 rounded-xl font-medium transition-colors text-sm xl:text-base whitespace-nowrap"
              >
                قارن فئات الخدمة
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
