import React, { useState, useEffect } from 'react';
import { Car, User as UserIcon, LogOut, Calendar, Wrench, PhoneCall, Menu, X, ChevronLeft } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  onNavigateSection: (
    target:
      | 'home'
      | 'services'
      | 'daily-rental'
      | 'fleet'
      | 'why-al-wakeel'
      | 'contact'
      | 'contact-footer'
      | 'my-bookings'
      | 'admin'
  ) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigateSection, onOpenBooking }) => {
  const [user, setUser] = useState<User | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAvatarError(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNav = (
    target:
      | 'home'
      | 'services'
      | 'daily-rental'
      | 'fleet'
      | 'why-al-wakeel'
      | 'contact'
      | 'contact-footer'
      | 'my-bookings'
      | 'admin'
  ) => {
    setMobileMenuOpen(false);
    onNavigateSection(target);
  };

  const isAdmin = user?.email === 'eyad.marine30@gmail.com';

  const navItems: Array<{
    id: 'home' | 'services' | 'daily-rental' | 'fleet' | 'why-al-wakeel' | 'contact' | 'contact-footer' | 'my-bookings' | 'admin';
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    isAdmin?: boolean;
  }> = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'services', label: 'انتقالات المطارات' },
    { id: 'daily-rental', label: 'التأجير اليومي' },
    { id: 'fleet', label: 'فئات الخدمة' },
    { id: 'contact', label: 'تواصل معنا' },
    ...(user ? [{ id: 'my-bookings' as const, label: 'سجل الحجوزات', icon: Calendar }] : []),
    ...(isAdmin ? [{ id: 'admin' as const, label: 'الإدارة', icon: Wrench, isAdmin: true }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#101D2D]/90 backdrop-blur-md border-b border-[#C9A96B]/20 text-[#F6F5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-6">
          
          {/* Brand Logo & Title */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0 text-right focus-visible:outline-2 focus-visible:outline-[#C9A96B] rounded-xl"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#C9A96B] flex items-center justify-center shadow-md shadow-black/20 group-hover:bg-[#d4b679] transition-colors shrink-0">
              <Car className="w-5 h-5 text-[#101D2D]" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-[14px] sm:text-base font-bold text-white leading-tight whitespace-nowrap truncate">
                الوكيل لخدمات الليموزين
              </span>
              <span className="font-latin text-[10.5px] sm:text-[11px] text-[#C9A96B]/90 leading-tight whitespace-nowrap truncate tracking-wide" dir="ltr">
                Al Wakeel Limousine · Since 2014
              </span>
            </div>
          </button>

          {/* Desktop Minimalist Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="التنقل الرئيسي">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#C9A96B] rounded-md ${
                    item.isAdmin
                      ? isActive
                        ? 'text-[#C9A96B] font-semibold'
                        : 'text-[#C9A96B]/85 hover:text-[#DFC89B]'
                      : isActive
                        ? 'text-white font-semibold'
                        : 'text-[#F6F5F1]/75 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-[#C9A96B] shrink-0" />}
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#C9A96B] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary CTA, Auth & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="tel:+201000053774"
              className="hidden xl:flex items-center gap-2 text-xs text-[#91B9C8] hover:text-white transition-colors px-2 py-2 whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C9A96B] shrink-0" />
              <span dir="ltr" className="font-latin font-semibold text-[#F6F5F1] tabular-nums">+201000053774</span>
            </a>

            <PWAInstallButton className="hidden sm:inline-flex" />

            <button
              type="button"
              onClick={onOpenBooking}
              className="bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold px-3.5 md:px-5 min-h-[40px] md:min-h-[42px] rounded-xl shadow-md shadow-black/20 transition-all active:scale-[0.98] text-xs md:text-sm whitespace-nowrap shrink-0 animate-pulse-gold"
            >
              احجز رحلتك
            </button>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center">
              {user ? (
                <div className="flex items-center gap-2 bg-[#152438] border border-[#C9A96B]/25 px-2.5 py-1.5 rounded-xl">
                  {user.photoURL && !avatarError ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'المستخدم'}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-7 h-7 rounded-full object-cover border border-[#C9A96B]/60"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#101D2D] border border-[#C9A96B]/40 flex items-center justify-center">
                      <UserIcon className="w-3.5 h-3.5 text-[#C9A96B]" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="تسجيل الخروج"
                    aria-label="تسجيل الخروج"
                    className="text-[#9A9A96] hover:text-red-400 transition-colors p-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  aria-label="تسجيل الدخول"
                  className="flex items-center gap-1.5 bg-[#152438] hover:bg-[#1c2f48] text-[#F6F5F1] border border-[#C9A96B]/25 px-3.5 min-h-[42px] rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                >
                  <UserIcon className="w-4 h-4 text-[#C9A96B] shrink-0" />
                  <span>دخول</span>
                </button>
              )}
            </div>

            {/* Mobile & Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="فتح قائمة التنقل"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-[#152438] border border-[#C9A96B]/30 flex items-center justify-center text-[#F6F5F1] hover:border-[#C9A96B]/60 transition-colors shrink-0"
            >
              <Menu className="w-5 h-5 text-[#C9A96B]" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="قائمة التنقل">
          <div
            className="fixed inset-0 bg-[#08101A]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 bottom-0 right-0 w-[86%] max-w-sm bg-[#101D2D] border-l border-[#C9A96B]/25 shadow-2xl flex flex-col justify-between overflow-y-auto">
            
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-[#C9A96B]/20 bg-[#152438]/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A96B] flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4 text-[#101D2D]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">الوكيل لخدمات الليموزين</p>
                    <p className="font-latin text-[11px] text-[#C9A96B]/90 truncate" dir="ltr">Al Wakeel Limousine · Since 2014</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="w-10 h-10 rounded-xl bg-[#152438] border border-[#C9A96B]/25 flex items-center justify-center text-[#9A9A96] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-5 space-y-1.5">
                <p className="font-label text-[#91B9C8] px-2 pb-1">القائمة الرئيسية</p>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 min-h-[48px] rounded-xl text-right transition-colors ${
                        isActive
                          ? 'bg-[#152438] text-[#C9A96B] border border-[#C9A96B]/35 font-semibold'
                          : 'text-[#F6F5F1] hover:bg-[#152438]/60 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        {Icon && <Icon className="w-4 h-4 text-[#C9A96B] shrink-0" />}
                        <span>{item.label}</span>
                      </span>
                      <ChevronLeft className={`w-4 h-4 ${isActive ? 'text-[#C9A96B]' : 'text-[#9A9A96]/60'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Primary CTA & Phone */}
              <div className="px-5 py-4 border-t border-[#C9A96B]/15 space-y-3">
                <PWAInstallButton className="w-full justify-center min-h-[44px] text-sm" />

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full min-h-[48px] rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm shadow-lg"
                >
                  احجز رحلتك
                </button>

                <a
                  href="tel:+201000053774"
                  className="w-full min-h-[46px] rounded-xl bg-[#152438] border border-[#C9A96B]/25 px-4 flex items-center justify-between text-sm text-[#F6F5F1]"
                >
                  <span className="flex items-center gap-2 text-[#91B9C8]">
                    <PhoneCall className="w-4 h-4 text-[#C9A96B]" />
                    <span>مكتب الحجز</span>
                  </span>
                  <span dir="ltr" className="font-latin font-semibold text-[#C9A96B] tabular-nums">+201000053774</span>
                </a>
              </div>
            </div>

            {/* Drawer Account Footer */}
            <div className="p-5 border-t border-[#C9A96B]/20 bg-[#152438]/40">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.photoURL && !avatarError ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'المستخدم'}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-9 h-9 rounded-full object-cover border border-[#C9A96B]/60 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#101D2D] border border-[#C9A96B]/40 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4 text-[#C9A96B]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.displayName || 'عميل مسجل'}</p>
                      <p className="text-xs text-[#9A9A96] truncate" dir="ltr">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="min-h-[40px] px-3 rounded-xl bg-[#101D2D] border border-[#C9A96B]/20 text-xs text-red-300 hover:text-red-200 flex items-center gap-1.5 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full min-h-[46px] rounded-xl bg-[#152438] border border-[#C9A96B]/30 text-sm font-medium text-white flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#C9A96B]" />
                  <span>تسجيل الدخول بحساب جوجل</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
