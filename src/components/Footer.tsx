import React from 'react';
import { Car, Shield, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (target: 'home' | 'services' | 'daily-rental' | 'fleet' | 'why-al-wakeel' | 'faq' | 'contact' | 'contact-footer') => void;
  onOpenBooking?: () => void;
}

const WHATSAPP_URL = 'https://wa.me/201000053774';
const OFFICIAL_ADDRESS_AR = 'أبراج قمراية – رشدي – طريق الجيش – ستانلي – الإسكندرية';

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const handleNav = (target: 'home' | 'services' | 'daily-rental' | 'fleet' | 'why-al-wakeel' | 'faq' | 'contact' | 'contact-footer') => {
    if (onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <footer
      id="contact-footer"
      className="bg-[#0B1522] text-[#F6F5F1] border-t border-[#C9A96B]/20 pt-10 pb-8 sm:pt-14 sm:pb-10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* 3 Logical Groups */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-right">
          
          {/* Group 1: Brand Identity & Description */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A96B] flex items-center justify-center text-[#101D2D] shadow-lg shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-card-heading text-white leading-tight">
                  الوكيل لخدمات الليموزين
                </h3>
                <p className="font-latin text-xs text-[#C9A96B]/90 tracking-wide" dir="ltr">
                  Al Wakeel Limousine · Since 2014
                </p>
              </div>
            </div>
            <p className="font-sub text-[#9A9A96] max-w-md leading-relaxed">
              تنظيم وتنسيق رحلات النقل الخاص والليموزين التنفيذي انطلاقاً من الإسكندرية إلى مطار برج العرب ومطار القاهرة والساحل الشمالي وجميع المحافظات بمعايير دقيقة.
            </p>
            <p className="font-label text-[#91B9C8]">خبرة تمتد منذ عام 2014</p>
          </div>

          {/* Group 2: Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-label text-[#C9A96B] font-semibold">روابط سريعة</h4>
            <ul className="space-y-1.5 font-sub text-[#9A9A96]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors py-1 text-right"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition-colors py-1 text-right"
                >
                  انتقالات المطارات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('daily-rental')}
                  className="hover:text-white transition-colors py-1 text-right"
                >
                  التأجير اليومي بالإسكندرية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('fleet')}
                  className="hover:text-white transition-colors py-1 text-right"
                >
                  أسطولنا
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('why-al-wakeel')}
                  className="hover:text-white transition-colors py-1 text-right"
                >
                  من نحن
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('faq')}
                  className="hover:text-white transition-colors py-1 text-right"
                >
                  الأسئلة الشائعة
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors py-1 text-right"
                >
                  تواصل معنا
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenBooking && onOpenBooking()}
                  className="text-[#C9A96B] hover:text-[#DFC89B] font-medium transition-colors py-1 text-right"
                >
                  احجز رحلتك
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: Interactive Contact Information */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-label text-[#C9A96B] font-semibold">تواصل معنا</h4>
            <ul className="space-y-2.5 font-sub text-[#9A9A96]">
              <li className="flex items-start gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-[#C9A96B] shrink-0 mt-0.5" />
                <span className="text-[#F6F5F1]/90 leading-relaxed select-text">{OFFICIAL_ADDRESS_AR}</span>
              </li>
              <li>
                <a
                  href="tel:+201000053774"
                  className="flex items-center gap-2.5 justify-start hover:text-white transition-colors py-0.5"
                >
                  <Phone className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span dir="ltr" className="font-latin text-[#F6F5F1] font-medium tabular-nums">+201000053774</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 justify-start hover:text-white transition-colors py-0.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#C9A96B] shrink-0" aria-hidden="true">
                    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5.016l-1.406 5.141 5.266-1.375c1.484.813 3.141 1.234 4.766 1.234 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406.016.578.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.531-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.5.125.688-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.891.891 2.219 1.047.328.156.547.234.625.359.078.125.078.734-.172 1.438z" />
                  </svg>
                  <span className="text-[#F6F5F1]">تواصل معنا عبر واتساب</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wakeellimousine.com"
                  className="flex items-center gap-2.5 justify-start hover:text-white transition-colors py-0.5"
                >
                  <Mail className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span dir="ltr" className="font-latin text-[#F6F5F1] font-medium">info@wakeellimousine.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#C9A96B]/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between font-sub text-[#9A9A96] gap-3">
          <p>© {new Date().getFullYear()} Al Wakeel Limousine – الوكيل لخدمات الليموزين. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2 text-[#91B9C8]">
            <Shield className="w-4 h-4 text-[#C9A96B] shrink-0" />
            <span>حجز مسبق بدون دفع إلكتروني · تأكيد هاتفي</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
