import React from 'react';
import { PhoneCall, MapPin } from 'lucide-react';
import { RevealBlock, LuxuryTiltCard } from './MotionCard';

const OFFICIAL_PHONE_DISPLAY = '+201000053774';
const OFFICIAL_TEL_HREF = 'tel:+201000053774';
const OFFICIAL_WHATSAPP_URL = 'https://wa.me/201000053774';
const OFFICIAL_ADDRESS_AR = 'أبراج قمراية – رشدي – طريق الجيش – الإسكندرية';

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5.016l-1.406 5.141 5.266-1.375c1.484.813 3.141 1.234 4.766 1.234 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406.016.578.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.531-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.5.125.688-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.891.891 2.219 1.047.328.156.547.234.625.359.078.125.078.734-.172 1.438z" />
  </svg>
);

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="section-shell bg-[#152438]/45 border-t border-[#C9A96B]/15 text-[#F6F5F1]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="space-y-2 max-w-2xl text-right">
            <div className="flex items-center gap-2 text-[#C9A96B] font-label">
              <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
              <span>التواصل الرسمي · الوكيل لخدمات الليموزين</span>
            </div>
            <h2 className="font-section-heading text-white">
              خلّي تفاصيل رحلتك أوضح قبل الحجز
            </h2>
            <p className="font-body text-[#9A9A96]">
              تحتاج تعرف أنسب فئة أو سعر مسارك من الإسكندرية إلى المطارات؟ تواصل مع مكتب الحجز لمراجعة تفاصيل الرحلة قبل إرسال الطلب.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* 1. Official Telephone */}
          <RevealBlock delayMs={0} className="h-full">
            <LuxuryTiltCard
              enableTilt={false}
              className="h-full bg-[#101D2D] border border-[#C9A96B]/25 hover:border-[#C9A96B]/55 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 text-right"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#152438] border border-[#C9A96B]/30 flex items-center justify-center text-[#C9A96B]">
                  <PhoneCall className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-card-heading text-white">محتار بين فئتين أو محتاج عرض سعر؟</h3>
                  <p className="font-sub text-[#9A9A96] mt-1">
                    اتصل لمراجعة عدد الركاب والحقائب والوجهة، ومعرفة السعر أو طلب عرض للمسار غير المدرج.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C9A96B]/15">
                <a
                  href={OFFICIAL_TEL_HREF}
                  className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-[#C9A96B] hover:text-[#DFC89B] transition-colors py-1"
                >
                  <span dir="ltr" className="font-latin tabular-nums select-all">
                    {OFFICIAL_PHONE_DISPLAY}
                  </span>
                </a>
              </div>
            </LuxuryTiltCard>
          </RevealBlock>

          {/* 2. Official WhatsApp */}
          <RevealBlock delayMs={70} className="h-full">
            <LuxuryTiltCard
              enableTilt={false}
              className="h-full bg-[#101D2D] border border-[#C9A96B]/25 hover:border-[#C9A96B]/55 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 text-right"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#152438] border border-[#C9A96B]/30 flex items-center justify-center text-[#C9A96B]">
                  <WhatsAppGlyph className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-card-heading text-white">واتساب</h3>
                  <p className="font-sub text-[#9A9A96] mt-1">
                    أرسل نقطة التحرك والوجهة والموعد وعدد الركاب والحقائب، لمراجعة المسار والسعر مع مكتب الحجز.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C9A96B]/15">
                <a
                  href={OFFICIAL_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <WhatsAppGlyph className="w-4 h-4 shrink-0" />
                  <span>خلّي تفاصيل رحلتك أوضح قبل الحجز عبر واتساب</span>
                </a>
              </div>
            </LuxuryTiltCard>
          </RevealBlock>

          {/* 3. Official Address */}
          <RevealBlock delayMs={140} className="h-full">
            <LuxuryTiltCard
              enableTilt={false}
              className="h-full bg-[#101D2D] border border-[#C9A96B]/25 hover:border-[#C9A96B]/55 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 text-right"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#152438] border border-[#C9A96B]/30 flex items-center justify-center text-[#C9A96B]">
                  <MapPin className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-card-heading text-white">عنواننا</h3>
                  <p className="font-sub text-[#9A9A96] mt-1">
                    عنوان مكتب الوكيل لخدمات الليموزين في رشدي، الإسكندرية.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C9A96B]/15">
                <p className="font-body text-[#F6F5F1] leading-relaxed select-text">
                  {OFFICIAL_ADDRESS_AR}
                </p>
              </div>
            </LuxuryTiltCard>
          </RevealBlock>

        </div>
      </div>
    </section>
  );
};
