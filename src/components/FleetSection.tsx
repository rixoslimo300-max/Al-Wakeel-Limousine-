import React, { useState } from 'react';
import { Users, Briefcase, Check, ArrowLeft } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { RevealBlock, LuxuryTiltCard } from './MotionCard';
import { VERIFIED_FLEET_MODELS, VerifiedFleetModel, FleetGroupKey } from '../data/verifiedFleet';
import { ServiceCategoryKey } from '../types';

interface FleetSectionProps {
  onSelectCategory: (category: ServiceCategoryKey) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onSelectCategory }) => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | FleetGroupKey>('all');

  const flagshipSoueast = VERIFIED_FLEET_MODELS.find((m) => m.id === 'soueast-s07');
  const suvFamilyModels = VERIFIED_FLEET_MODELS.filter(
    (m) => m.group === 'suv-family' && m.id !== 'soueast-s07'
  );
  const sedanModels = VERIFIED_FLEET_MODELS.filter((m) => m.group === 'sedan');

  const renderModelCard = (model: VerifiedFleetModel, idx: number) => (
    <RevealBlock key={model.id} delayMs={Math.min(idx * 55, 220)} className="h-full">
      <LuxuryTiltCard
        enableTilt={true}
        className="h-full bg-[#152438] border border-[#C9A96B]/20 hover:border-[#C9A96B]/60 rounded-2xl overflow-hidden flex flex-col group"
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#0B1522]">
          <SafeImage
            src={model.imageUrl}
            alt={`${model.nameAr} (${model.nameEn})`}
            variant={model.group === 'suv-family' ? 'suv' : 'sedan'}
            className="w-full h-full object-cover object-center opacity-92 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#152438] via-[#152438]/25 to-transparent" />
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4 text-right">
          <div className="flex-1 flex flex-col">
            {/* Title Block */}
            <div className="md:min-h-[3.5rem]">
              <h3 className="font-card-heading text-white leading-snug group-hover:text-[#DFC89B] transition-colors">
                {model.nameAr}
              </h3>
              <p className="font-latin text-xs text-[#91B9C8] mt-1 leading-normal" dir="ltr">
                {model.nameEn}
              </p>
            </div>

            {/* Editorial Capacity & Color Specification Row */}
            <div className="my-3.5 py-2.5 border-y border-[#C9A96B]/20 space-y-2 md:min-h-[4.5rem] flex flex-col justify-center">
              <div className="flex items-center justify-between text-[#F6F5F1]/90 font-label tabular-nums">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>حتى {model.passengers} ركاب</span>
                </div>
                <span className="w-px h-4 bg-[#C9A96B]/25" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>حتى {model.luggage} حقائب</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-label pt-1.5 border-t border-[#C9A96B]/10">
                {model.colorConfirmed && model.colorSwatchHex ? (
                  <>
                    <span
                      className="w-3 h-3 rounded-full border border-[#C9A96B]/60 shrink-0"
                      style={{ backgroundColor: model.colorSwatchHex }}
                      aria-hidden="true"
                    />
                    <span className="text-[#DFC89B] font-medium">
                      اللون المؤكد: {model.colorLabelAr}
                    </span>
                  </>
                ) : (
                  <span className="text-[#9A9A96]">
                    {model.colorLabelAr}
                  </span>
                )}
              </div>
            </div>

            {/* Descriptive Text */}
            <p className="font-sub text-[#9A9A96] leading-relaxed">
              {model.descriptionAr}
            </p>
          </div>

          {/* Features & Booking Action */}
          <div className="space-y-4 pt-3 border-t border-[#C9A96B]/15">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {model.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-1.5 font-sub text-[#F6F5F1]/90">
                  <Check className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSelectCategory(model.group === 'sedan' ? 'sedan_comfort' : 'suv_premium')}
              className="w-full min-h-[46px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm sm:text-base"
            >
              احجز رحلة بهذه الفئة
            </button>
          </div>
        </div>
      </LuxuryTiltCard>
    </RevealBlock>
  );

  return (
    <section className="section-shell bg-[#101D2D] text-[#F6F5F1] border-t border-[#C9A96B]/15" id="fleet">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-3xl space-y-2.5 text-right">
            <div className="flex items-center gap-2 text-[#C9A96B] font-label">
              <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
              <span>الأسطول التنفيذي والعائلي</span>
            </div>
            <h2 className="font-section-heading text-white">
              مركبات حديثة ومجهزة لأرقى معايير التنقل
            </h2>
            <p className="font-body text-[#9A9A96]">
              نماذج من أسطولنا التنفيذي والعائلي، ويتم تخصيص السيارة المناسبة داخلياً من قِبل إدارة التشغيل وفق خط السير وعدد الركاب وفئة الخدمة المختارة.
            </p>
          </div>

          {/* Interactive Category Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-[#152438] border border-[#C9A96B]/20 rounded-xl self-start lg:self-end overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setSelectedGroup('all')}
              className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                  : 'text-[#9A9A96] hover:text-white'
              }`}
            >
              جميع الفئات ({VERIFIED_FLEET_MODELS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedGroup('suv-family')}
              className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGroup === 'suv-family'
                  ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                  : 'text-[#9A9A96] hover:text-white'
              }`}
            >
              الدفع الرباعي والعائلية ({suvFamilyModels.length + (flagshipSoueast ? 1 : 0)})
            </button>
            <button
              type="button"
              onClick={() => setSelectedGroup('sedan')}
              className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGroup === 'sedan'
                  ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                  : 'text-[#9A9A96] hover:text-white'
              }`}
            >
              السيدان ({sedanModels.length})
            </button>
          </div>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {(selectedGroup === 'all' || selectedGroup === 'suv-family') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#C9A96B]/20 pb-3">
                <div className="text-right">
                  <h3 className="font-subheading text-white">فئة الدفع الرباعي والعائلية</h3>
                  <p className="font-latin text-xs text-[#91B9C8]" dir="ltr">SUV &amp; Family Vehicles</p>
                </div>
                <span className="font-label text-[#C9A96B] tabular-nums">
                  {suvFamilyModels.length + (flagshipSoueast ? 1 : 0)} موديلات
                </span>
              </div>

              {/* Flagship Featured Black Soueast S07 Showcase */}
              {flagshipSoueast && (
                <RevealBlock>
                  <LuxuryTiltCard
                    enableTilt={true}
                    className="bg-[#152438] border border-[#C9A96B]/35 hover:border-[#C9A96B]/75 rounded-2xl overflow-hidden group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">
                      <div className="lg:col-span-7 lg:pr-6 lg:py-6">
                        <div className="relative aspect-video w-full overflow-hidden bg-[#0B1522] lg:rounded-xl lg:border lg:border-[#C9A96B]/20">
                          <SafeImage
                            src={flagshipSoueast.imageUrl}
                            alt={`${flagshipSoueast.nameAr} (${flagshipSoueast.nameEn})`}
                            variant="suv"
                            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                          />
                          <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#152438] to-transparent" />
                        </div>
                      </div>

                      <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between gap-4 text-right">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#C9A96B] font-label">
                            <span className="w-4 h-px bg-[#C9A96B]" aria-hidden="true" />
                            <span>السيارة الرئيسية في الأسطول التنفيذي</span>
                          </div>

                          <div>
                            <h3 className="font-section-heading text-white leading-snug group-hover:text-[#DFC89B] transition-colors">
                              {flagshipSoueast.nameAr}
                            </h3>
                            <p className="font-latin text-xs text-[#91B9C8] mt-0.5" dir="ltr">
                              {flagshipSoueast.nameEn}
                            </p>
                          </div>

                          <div className="py-2.5 border-y border-[#C9A96B]/20 space-y-2">
                            <div className="flex items-center justify-between text-[#F6F5F1] font-label tabular-nums">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#C9A96B] shrink-0" />
                                <span>حتى {flagshipSoueast.passengers} ركاب</span>
                              </div>
                              <span className="w-px h-4 bg-[#C9A96B]/25" aria-hidden="true" />
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-[#C9A96B] shrink-0" />
                                <span>حتى {flagshipSoueast.luggage} حقائب</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 font-label pt-1.5 border-t border-[#C9A96B]/10">
                              <span
                                className="w-3 h-3 rounded-full border border-[#C9A96B]/60 shrink-0"
                                style={{ backgroundColor: flagshipSoueast.colorSwatchHex }}
                                aria-hidden="true"
                              />
                              <span className="text-[#DFC89B] font-semibold">
                                اللون المؤكد: {flagshipSoueast.colorLabelAr}
                              </span>
                            </div>
                          </div>

                          <p className="font-body text-[#9A9A96] leading-relaxed">
                            {flagshipSoueast.descriptionAr}
                          </p>

                          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
                            {flagshipSoueast.features.map((feature, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-1.5 font-sub text-[#F6F5F1]/90">
                                <Check className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectCategory('suv_premium')}
                          className="w-full min-h-[48px] bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold py-3 px-5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <span>احجز رحلة بفئة SUV بريميوم</span>
                          <ArrowLeft className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </LuxuryTiltCard>
                </RevealBlock>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                {suvFamilyModels.map((model, idx) => renderModelCard(model, idx))}
              </div>
            </div>
          )}

          {(selectedGroup === 'all' || selectedGroup === 'sedan') && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#C9A96B]/20 pb-3">
                <div className="text-right">
                  <h3 className="font-subheading text-white">فئة السيدان التنفيذية</h3>
                  <p className="font-latin text-xs text-[#91B9C8]" dir="ltr">Executive Sedans</p>
                </div>
                <span className="font-label text-[#C9A96B] tabular-nums">{sedanModels.length} موديلات</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                {sedanModels.map((model, idx) => renderModelCard(model, idx))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
