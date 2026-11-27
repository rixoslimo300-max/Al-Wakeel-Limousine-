import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Users, Briefcase, ArrowLeft, Camera } from 'lucide-react';
import { VerifiedFleetModel } from '../data/verifiedFleet';
import { FLEET_DETAIL_GALLERIES, VehicleGalleryShot } from '../data/fleetGalleries';
import { ServiceCategoryKey } from '../types';

interface VehicleGalleryModalProps {
  model: VerifiedFleetModel | null;
  onClose: () => void;
  onBookCategory: (category: ServiceCategoryKey | null) => void;
}

export const VehicleGalleryModal: React.FC<VehicleGalleryModalProps> = ({
  model,
  onClose,
  onBookCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const shots: VehicleGalleryShot[] = model ? FLEET_DETAIL_GALLERIES[model.id] || [] : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [model?.id]);

  const handleNext = useCallback(() => {
    if (shots.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % shots.length);
  }, [shots.length]);

  const handlePrev = useCallback(() => {
    if (shots.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + shots.length) % shots.length);
  }, [shots.length]);

  useEffect(() => {
    if (!model) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [model, onClose, handleNext, handlePrev]);

  if (!model || shots.length === 0) {
    return null;
  }

  const activeShot = shots[activeIndex] || shots[0];

  const resolveBookingCategory = (m: VerifiedFleetModel): ServiceCategoryKey | null => {
    if (m.group === 'sedan') return 'sedan_comfort';
    if (m.group === 'suv-family') return 'suv_premium';
    if (m.group === 'mini-van-premium') return 'mini_van_premium';
    return null;
  };

  const bookingCategory = resolveBookingCategory(model);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#070E17]/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-gallery-title"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[94vh] overflow-y-auto bg-[#101D2D] border border-[#C9A96B]/35 rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#C9A96B]/20 bg-[#0B1522]/60">
          <div className="text-right min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 id="vehicle-gallery-title" className="font-card-heading text-white truncate">
                {model.nameAr}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-[#152438] border border-[#C9A96B]/30 text-[#DFC89B]">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-[#C9A96B]/60 shrink-0"
                  style={{ backgroundColor: model.colorSwatchHex }}
                  aria-hidden="true"
                />
                {model.colorLabelAr}
              </span>
            </div>
            <p className="font-latin text-xs text-[#91B9C8] mt-0.5 truncate" dir="ltr">
              {model.nameEn} · {shots.length} Curated Shots
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق المعرض"
            className="w-10 h-10 rounded-xl bg-[#152438] hover:bg-[#1D3048] border border-[#C9A96B]/25 text-[#F6F5F1] flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative bg-[#070E17] rounded-xl border border-[#C9A96B]/20 overflow-hidden flex items-center justify-center">
            <div className="w-full max-w-[740px] mx-auto aspect-[4/3] sm:max-h-[52vh] flex items-center justify-center">
              <img
                src={activeShot.imageUrl}
                alt={`${model.nameAr} — ${activeShot.labelAr}`}
                width={activeShot.width}
                height={activeShot.height}
                loading="eager"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </div>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="الصورة السابقة"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101D2D]/85 hover:bg-[#C9A96B] text-white hover:text-[#101D2D] border border-[#C9A96B]/35 flex items-center justify-center transition-colors shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="الصورة التالية"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101D2D]/85 hover:bg-[#C9A96B] text-white hover:text-[#101D2D] border border-[#C9A96B]/35 flex items-center justify-center transition-colors shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 text-[#DFC89B] font-label">
              <Camera className="w-4 h-4 text-[#C9A96B] shrink-0" />
              <span>{activeShot.labelAr}</span>
            </div>
            <p className="font-sub text-[#9A9A96] leading-relaxed">{activeShot.captionAr}</p>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3" role="tablist" aria-label="زوايا وتفاصيل السيارة">
            {shots.map((shot, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={shot.category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(idx)}
                  className={`group text-right rounded-xl overflow-hidden border transition-all bg-[#0B1522] ${
                    isActive
                      ? 'border-[#C9A96B] ring-2 ring-[#C9A96B]/40'
                      : 'border-[#C9A96B]/20 hover:border-[#C9A96B]/55 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={shot.imageUrl}
                      alt={shot.labelAr}
                      width={shot.width}
                      height={shot.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span
                    className={`hidden sm:block px-2 py-1.5 text-[11px] truncate font-medium ${
                      isActive ? 'text-[#DFC89B] bg-[#152438]' : 'text-[#9A9A96]'
                    }`}
                  >
                    {shot.labelAr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#C9A96B]/20 bg-[#0B1522]/75 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs sm:text-sm text-[#F6F5F1]/90 tabular-nums">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#C9A96B] shrink-0" />
              <span>حتى {model.passengers} ركاب</span>
            </div>
            <span className="w-px h-4 bg-[#C9A96B]/25" aria-hidden="true" />
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#C9A96B] shrink-0" />
              <span>
                {model.id === 'toyota-hiace-m55' ? '+6 حقائب' : `حتى ${model.luggage} حقائب`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onBookCategory(bookingCategory);
            }}
            className="min-h-[46px] px-5 py-2.5 bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>
              {bookingCategory ? 'احجز رحلة بهذه الفئة' : 'ابدأ الحجز — تخصيص تلقائي للسيارة'}
            </span>
            <ArrowLeft className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
