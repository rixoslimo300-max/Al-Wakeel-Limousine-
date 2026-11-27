import React, { useState } from 'react';
import { Download, Share2, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'banner' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'pill') {
      return (
        <button
          onClick={install}
          type="button"
          aria-label="تثبيت التطبيق على جهازك"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A96B]/15 hover:bg-[#C9A96B]/25 border border-[#C9A96B]/35 text-[#DFC89B] hover:text-white text-xs font-semibold transition ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#C9A96B]" />
          <span>تثبيت التطبيق</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        type="button"
        aria-label="تثبيت تطبيق الوكيل ليموزين"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C9A96B] to-[#b38f52] hover:brightness-110 text-[#101D2D] text-xs font-bold shadow-md shadow-[#C9A96B]/20 transition active:scale-95 whitespace-nowrap ${className}`}
      >
        <Smartphone className="w-4 h-4 shrink-0 text-[#101D2D]" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          type="button"
          aria-label="تعليمات تثبيت التطبيق على آيفون"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C9A96B]/35 bg-[#101D2D]/80 hover:bg-[#101D2D] text-[#DFC89B] text-xs font-medium transition ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#C9A96B]" />
          <span>تثبيت على iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#101D2D] border border-[#C9A96B]/40 p-6 shadow-2xl text-white text-right">
              <div className="flex items-center justify-between pb-3 border-b border-[#C9A96B]/20 mb-4">
                <h3 className="text-base font-bold text-[#DFC89B]">تثبيت تطبيق الوكيل على iPhone / iPad</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#9A9A96] hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-[#E2E8F0] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A96B]/20 text-[#DFC89B] text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <p>
                    اضغط على أيقونة <strong className="text-[#C9A96B] font-semibold">المشاركة</strong> (<Share2 className="inline w-3.5 h-3.5 mx-1" />) في شريط متصفح Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A96B]/20 text-[#DFC89B] text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <p>
                    مرر لأسفل واضغط على <strong className="text-[#C9A96B] font-semibold">إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A96B]/20 text-[#DFC89B] text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    اضغط على <strong className="text-[#C9A96B] font-semibold">إضافة (Add)</strong> بالأعلى لتشغيل التطبيق كأي تطبيق أصيل.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#C9A96B] py-2.5 text-sm font-bold text-[#101D2D] hover:bg-[#d4b679] transition"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
