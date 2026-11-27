import React from 'react';
import { UserCheck, Clock, ShieldCheck, Route, ClipboardCheck } from 'lucide-react';
import { RevealBlock } from './MotionCard';

const PILLARS = [
  {
    id: 'drivers',
    icon: UserCheck,
    titleAr: 'استقبال وتعامل مهني',
    descriptionAr: 'تواصل واضح وآداب استقبال وقيادة تراعي طبيعة الرحلة داخل المدن وعلى الطرق السريعة.',
  },
  {
    id: 'punctuality',
    icon: Clock,
    titleAr: 'تنسيق مرتبط بموعد رحلتك',
    descriptionAr: 'نراجع موعد الانطلاق أو الوصول وبيانات الرحلة التي تقدمها، حتى تكون تفاصيل التحرك واضحة قبل التنفيذ.',
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    titleAr: 'سيارة مخصصة لك ولرفاقك',
    descriptionAr: 'تنتقل أنت وعائلتك أو ضيوفك في رحلة خاصة دون مشاركة السيارة مع ركاب آخرين.',
  },
  {
    id: 'coordination',
    icon: Route,
    titleAr: 'تفاصيل الرحلة في صورة واحدة',
    descriptionAr: 'نراجع نقطة الاستلام والوجهة والموعد والتوقفات المتفق عليها قبل تنفيذ الرحلة.',
  },
  {
    id: 'management',
    icon: ClipboardCheck,
    titleAr: 'سعر وتفاصيل قبل التأكيد',
    descriptionAr: 'تراجع تفاصيل المسار والسعر النهائي مع مكتب الحجز قبل تنفيذ الرحلة، دون دفع إلكتروني مسبق.',
  },
];

export const WhyAlWakeelSection: React.FC = () => {
  return (
    <section
      id="why-al-wakeel"
      className="section-shell bg-[#101D2D] border-t border-[#C9A96B]/15 text-[#F6F5F1]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Editorial Intro Column */}
          <div className="lg:col-span-4 space-y-3 text-right">
            <div className="flex items-center gap-2 text-[#C9A96B] font-label">
              <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
              <span>لماذا الوكيل لخدمات الليموزين</span>
            </div>
            <h2 className="font-section-heading text-white">
              اختيار واضح… من الفئة المناسبة حتى تفاصيل الرحلة
            </h2>
            <p className="font-body text-[#9A9A96] leading-relaxed">
              بدل ما تحتار بين أنواع السيارات أو تخمّن سعة الأمتعة، اختار فئة خدمة واضحة وأدخل عدد الركاب والحقائب. يحدد النظام التخصيص وفق السعة، وتراجع السعر أو تطلب عرضًا قبل تأكيد الحجز.
            </p>
          </div>

          {/* Minimal Line-Icon Pillars Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <RevealBlock
                  key={pillar.id}
                  delayMs={idx * 55}
                  className={idx === PILLARS.length - 1 ? 'sm:col-span-2' : ''}
                >
                  <div className="h-full bg-[#152438]/80 border border-[#C9A96B]/20 rounded-2xl p-5 sm:p-6 flex items-start gap-4 text-right hover:border-[#C9A96B]/45 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#101D2D] border border-[#C9A96B]/30 flex items-center justify-center text-[#C9A96B] shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-subheading text-white">{pillar.titleAr}</h3>
                      <p className="font-sub text-[#9A9A96] leading-relaxed">{pillar.descriptionAr}</p>
                    </div>
                  </div>
                </RevealBlock>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
