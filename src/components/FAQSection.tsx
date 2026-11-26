import React, { useState } from 'react';
import { ChevronDown, ArrowUpLeft, HelpCircle } from 'lucide-react';
import { RevealBlock } from './MotionCard';
import {
  OFFICIAL_WHATSAPP_BASE_URL,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_TEL_HREF,
} from '../lib/bookingEngine';

type FaqCategory = 'all' | 'payment' | 'policies' | 'coverage';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  categoryLabelAr: string;
  questionAr: string;
  answerAr: string;
}

interface FAQSectionProps {
  onOpenBooking?: () => void;
}

const FAQ_CATEGORIES: Array<{ key: FaqCategory; labelAr: string }> = [
  { key: 'all', labelAr: 'جميع الأسئلة' },
  { key: 'payment', labelAr: 'الدفع والأسعار' },
  { key: 'policies', labelAr: 'سياسة الحجز والانتظار' },
  { key: 'coverage', labelAr: 'نطاق التغطية' },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-prepayment',
    category: 'payment',
    categoryLabelAr: 'الدفع والأسعار',
    questionAr: 'هل يتطلب تأكيد الحجز دفعاً إلكترونياً أو رسوماً مسبقة؟',
    answerAr:
      'لا توجد رسوم مسبقة عند الحجز ولا يتطلب تأكيد الطلب أي دفع إلكتروني. يتم السداد نقداً عند تنفيذ الرحلة وفق السعر المعتمد والمؤكد مع العميل.',
  },
  {
    id: 'faq-airport-pricing',
    category: 'payment',
    categoryLabelAr: 'الدفع والأسعار',
    questionAr: 'ما هي الأسعار المعتمدة لانتقالات المطارات وماذا يشمل السعر؟',
    answerAr:
      'الأسعار ثابتة لاتجاه واحد (ذهاب أو عودة) بين الإسكندرية والمطارات المعتمدة: مطار برج العرب الدولي (Comfort Sedan: 850 جنيه · Premium SUV: 1,200 جنيه)، مطار القاهرة الدولي (Comfort Sedan: 1,850 جنيه · Premium SUV: 2,200 جنيه)، ومطار سفنكس الدولي (Comfort Sedan: 1,850 جنيه · Premium SUV: 2,200 جنيه)، وتشمل رسوم الطريق ودخول المطار.',
  },
  {
    id: 'faq-daily-rental-pricing',
    category: 'payment',
    categoryLabelAr: 'الدفع والأسعار',
    questionAr: 'ما هي باقات التأجير اليومي المتاحة داخل الإسكندرية وأسعارها؟',
    answerAr:
      'تتوفر باقتان مستقلتان للتأجير اليومي داخل الإسكندرية فقط: باقة 8 ساعات بسعر 2,800 جنيه مصري (بحد أقصى 8 ساعات و120 كم)، وباقة 12 ساعة بسعر 3,600 جنيه مصري (بحد أقصى 12 ساعة و150 كم).',
  },
  {
    id: 'faq-custom-routes',
    category: 'payment',
    categoryLabelAr: 'الدفع والأسعار',
    questionAr: 'كيف يتم تسعير الرحلات خارج قائمة المطارات المعتمدة؟',
    answerAr:
      'بالنسبة للمسارات غير المدرجة في جدول الأسعار الثابتة (مثل رحلات الساحل الشمالي أو المحافظات الأخرى أو الرحلات التي تتجاوز 5 ركاب)، يرجى التواصل معنا للحصول على عرض سعر خاص قبل تأكيد التنفيذ.',
  },
  {
    id: 'faq-privacy-vehicle',
    category: 'policies',
    categoryLabelAr: 'سياسة الحجز والانتظار',
    questionAr: 'هل الرحلة خاصة أم تتم مشاركة السيارة مع ركاب آخرين؟ وكيف يتم تحديد السيارة؟',
    answerAr:
      'جميع رحلات الوكيل خاصة وبخصوصية كاملة دون مشاركة السيارة مع أي راكب آخر. يقوم العميل باختيار المسار وفئة الخدمة المناسبة لعدد الركاب (Comfort Sedan أو Premium SUV لـ 1–3 ركاب، وMini Van لـ 4–5 ركاب)، ويتولى فريق التشغيل تخصيص السيارة المناسبة داخلياً من الأسطول.',
  },
  {
    id: 'faq-waiting-time',
    category: 'policies',
    categoryLabelAr: 'سياسة الحجز والانتظار',
    questionAr: 'ما هي مدة الانتظار المجانية المتاحة في انتقالات المطارات والرحلات؟',
    answerAr:
      'تتيح خدمة انتقالات المطارات 45 دقيقة انتظار مجانية عند استقبال رحلات الوصول في المطار، و30 دقيقة انتظار مجانية للرحلات العادية.',
  },
  {
    id: 'faq-modify-cancel',
    category: 'policies',
    categoryLabelAr: 'سياسة الحجز والانتظار',
    questionAr: 'هل يمكن تعديل موعد الرحلة أو إلغاء الحجز بعد تقديم الطلب؟',
    answerAr:
      'نعم، تتوفر إمكانية التعديل أو الإلغاء وفق سياسة الحجز المعتمدة. يمكنك التواصل السريع مع مكتب الحجز عبر واتساب أو الاتصال المباشر على الرقم +201000053774 لتنسيق أي تعديل في الموعد أو تفاصيل الاستلام.',
  },
  {
    id: 'faq-coverage-airports',
    category: 'coverage',
    categoryLabelAr: 'نطاق التغطية',
    questionAr: 'ما هي المطارات والمناطق التي تغطيها خدمات الوكيل لخدمات الليموزين؟',
    answerAr:
      'تغطي الخدمة انتقالات المطارات بالاتجاهين بين الإسكندرية وكل من مطار برج العرب الدولي ومطار القاهرة الدولي ومطار سفنكس الدولي، بالإضافة إلى التأجير اليومي داخل نطاق الإسكندرية، والرحلات الخاصة إلى الساحل الشمالي (مارينا والعلمين الجديدة) ومختلف المحافظات المصرية حسب الطلب.',
  },
  {
    id: 'faq-daily-scope',
    category: 'coverage',
    categoryLabelAr: 'نطاق التغطية',
    questionAr: 'هل باقات التأجير اليومي تشمل السفر خارج الإسكندرية؟',
    answerAr:
      'باقتا التأجير اليومي (8 ساعات / 120 كم و12 ساعة / 150 كم) مخصصتان للاستخدام داخل نطاق الإسكندرية فقط. وللتنقلات بين المدن أو خارج الإسكندرية يتم التنسيق كرحلة انتقال خاصة وفق مسار الرحلة.',
  },
];

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-prepayment': true,
  });

  const filteredItems =
    selectedCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faq"
      className="section-shell bg-[#101D2D] border-t border-[#C9A96B]/15 text-[#F6F5F1]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Header & Category Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5 text-right">
            <div className="flex items-center gap-2 text-[#C9A96B] font-label">
              <span className="w-5 h-px bg-[#C9A96B]/70 shrink-0" aria-hidden="true" />
              <span>الأسئلة الشائعة · FAQ</span>
            </div>
            <h2 className="font-section-heading text-white">
              إجابات واضحة حول الحجز والدفع ونطاق الخدمة
            </h2>
            <p className="font-body text-[#9A9A96] leading-relaxed">
              تعرّف على تفاصيل الدفع، سياسات الحجز والانتظار، ومناطق التغطية لانتقالات المطارات والتأجير اليومي داخل الإسكندرية.
            </p>
          </div>

          {/* Interactive Category Filter Control */}
          <div
            className="flex items-center gap-1.5 p-1 bg-[#152438] border border-[#C9A96B]/20 rounded-xl self-start lg:self-end overflow-x-auto max-w-full"
            role="tablist"
            aria-label="تصنيف الأسئلة الشائعة"
          >
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                      : 'text-[#9A9A96] hover:text-white'
                  }`}
                >
                  {cat.labelAr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        <RevealBlock>
          <div className="bg-[#152438]/75 border border-[#C9A96B]/20 rounded-2xl divide-y divide-[#C9A96B]/15 overflow-hidden">
            {filteredItems.map((item) => {
              const isOpen = Boolean(openIds[item.id]);
              const panelId = `${item.id}-panel`;
              const buttonId = `${item.id}-button`;

              return (
                <div key={item.id} className="transition-colors">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-5 py-4 sm:px-7 sm:py-5 flex items-center justify-between gap-4 text-right hover:bg-[#152438] transition-colors focus-visible:outline-2 focus-visible:outline-[#C9A96B]"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="font-label text-[#C9A96B] block">
                          {item.categoryLabelAr}
                        </span>
                        <span
                          className={`block font-subheading leading-snug transition-colors ${
                            isOpen ? 'text-[#DFC89B]' : 'text-white'
                          }`}
                        >
                          {item.questionAr}
                        </span>
                      </div>

                      <span
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isOpen
                            ? 'bg-[#C9A96B] border-[#C9A96B] text-[#101D2D]'
                            : 'bg-[#101D2D] border-[#C9A96B]/25 text-[#C9A96B]'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className={isOpen ? 'px-5 pb-5 sm:px-7 sm:pb-6 pt-0 text-right' : 'hidden'}
                  >
                    <p className="font-body text-[#F6F5F1]/85 leading-relaxed border-t border-[#C9A96B]/15 pt-4">
                      {item.answerAr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealBlock>

        {/* Bottom Support Prompt */}
        <div className="bg-[#152438] border border-[#C9A96B]/25 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-right">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#101D2D] border border-[#C9A96B]/30 flex items-center justify-center text-[#C9A96B] shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-subheading text-white">هل لديك استفسار خاص حول رحلتك؟</h3>
              <p className="font-sub text-[#9A9A96]">
                فريق مكتب الحجز متاح للرد على استفساراتك وتأكيد التفاصيل مباشرة عبر الهاتف أو واتساب.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenBooking && (
              <button
                type="button"
                onClick={onOpenBooking}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <span>احجز رحلتك الآن</span>
                <ArrowUpLeft className="w-4 h-4 shrink-0" />
              </button>
            )}
            <a
              href={OFFICIAL_WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#101D2D] hover:bg-[#0B1522] border border-[#C9A96B]/30 text-[#F6F5F1] text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>واتساب مباشر</span>
            </a>
            <a
              href={OFFICIAL_TEL_HREF}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#101D2D] border border-[#C9A96B]/20 text-[#91B9C8] hover:text-white text-sm font-medium inline-flex items-center transition-colors whitespace-nowrap"
              dir="ltr"
            >
              <span className="font-latin tabular-nums">{OFFICIAL_WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
