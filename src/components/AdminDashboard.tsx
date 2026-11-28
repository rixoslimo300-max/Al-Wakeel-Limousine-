import React, { useEffect, useState } from 'react';
import { Booking, Service, Vehicle, PricingRule, BookingStatus, ServiceCategoryKey } from '../types';
import {
  db,
  auth,
  collection,
  updateDoc,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  OperationType,
  handleFirestoreError,
  isOfflineOrNetworkError,
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Wrench, Plus, Trash2, WifiOff, Edit3, Car, ShieldAlert } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { VERIFIED_FLEET_MODELS } from '../data/verifiedFleet';
import {
  INTERNAL_ASSIGNMENT_POOLS,
  SERVICE_CATEGORIES,
  extractStructuredRouteRules,
} from '../lib/bookingEngine';

interface AdminDashboardProps {
  services: Service[];
  vehicles: Vehicle[];
  pricingRules: PricingRule[];
  onPricingRulesUpdated?: (rules: PricingRule[]) => void;
}

function resolveBookingCategoryKey(booking: Booking): ServiceCategoryKey {
  if (booking.serviceCategory && SERVICE_CATEGORIES[booking.serviceCategory]) {
    return booking.serviceCategory;
  }
  if (booking.vehicleCategoryId === 'premium-minivan') {
    return 'mini_van_premium';
  }
  if (booking.passengersCount > 6 || booking.vehicleCategoryId === 'family-van') {
    return 'mini_van';
  }
  if (booking.vehicleCategoryId === 'vip-suv') {
    return 'suv_premium';
  }
  return 'sedan_comfort';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  vehicles,
  pricingRules,
  onPricingRulesUpdated,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authChecked, setAuthChecked] = useState(Boolean(auth.currentUser));
  const [activeTab, setActiveTab] = useState<'bookings' | 'pricing' | 'fleet'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineNotice, setOfflineNotice] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const structuredRules = extractStructuredRouteRules(pricingRules);

  // Route Pricing Configuration Form State (Add or Edit)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleRouteName, setRuleRouteName] = useState('');
  const [ruleOrigin, setRuleOrigin] = useState('');
  const [ruleDestination, setRuleDestination] = useState('');
  const [ruleSedanPrice, setRuleSedanPrice] = useState<string>('');
  const [ruleSuvPrice, setRuleSuvPrice] = useState<string>('');
  const [ruleMiniVanPrice, setRuleMiniVanPrice] = useState<string>('');
  const [ruleMiniVanPremiumPrice, setRuleMiniVanPremiumPrice] = useState<string>('');
  const [ruleIsActive, setRuleIsActive] = useState<boolean>(true);
  const [ruleNotes, setRuleNotes] = useState<string>('');
  const [confirmDeleteRuleId, setConfirmDeleteRuleId] = useState<string | null>(null);

  // Selected booking for Price + Internal Vehicle Assignment modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [finalPriceInput, setFinalPriceInput] = useState<number>(0);
  const [priceNotesInput, setPriceNotesInput] = useState<string>('');
  const [assignedVehicleInput, setAssignedVehicleInput] = useState<string>('');
  const [assignedDriverInput, setAssignedDriverInput] = useState<string>('');
  const [assignmentStatusInput, setAssignmentStatusInput] = useState<'unassigned' | 'assigned'>('unassigned');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  const isAdmin =
    user?.email === 'eyad.marine30@gmail.com' &&
    user.emailVerified === true;

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        clearTimeout(timer);
        setOfflineNotice(false);
        const list: Booking[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Booking);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(list);
        setLoading(false);
      },
      (error) => {
        clearTimeout(timer);
        if (isOfflineOrNetworkError(error)) {
          setOfflineNotice(true);
          setLoading(false);
          return;
        }
        setLoading(false);
        try {
          handleFirestoreError(error, OperationType.GET, 'bookings');
        } catch {
          // Logged via handleFirestoreError
        }
      }
    );

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [isAdmin]);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  if (authChecked && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5 py-10 bg-[#101D2D] text-[#F6F5F1]">
        <div className="bg-[#152438] border border-[#C9A96B]/30 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-[#C9A96B] mx-auto" />
          <h2 className="font-section-heading text-white">صلاحية الإدارة مطلوبة</h2>
          <p className="font-body text-[#9A9A96]">
            لوحة الإدارة والتسعير مخصصة لمديري التشغيل المصرح لهم فقط. يرجى تسجيل الدخول بحساب الإدارة المعتمد.
          </p>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
      showNotice('success', 'تم تحديث حالة الطلب بنجاح.');
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        showNotice('error', 'تعذر الاتصال بالخادم. يرجى المحاولة عند استعادة الاتصال.');
      } else {
        showNotice('error', 'تعذر تحديث الحالة. تأكد من صلاحيات الإدارة.');
        try {
          handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
        } catch {
          // Logged
        }
      }
    }
  };

  const handleSaveBookingManagement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    try {
      const nextStatus: BookingStatus =
        selectedBooking.status === 'pending_review' && finalPriceInput > 0
          ? 'quote_provided'
          : selectedBooking.status;

      const payload: Partial<Booking> = {
        finalAgreedPrice: Number(finalPriceInput),
        priceNotes: priceNotesInput,
        status: nextStatus,
        assignedVehicleModel: assignedVehicleInput.trim(),
        assignedDriverName: assignedDriverInput.trim(),
        assignmentStatus: assignedVehicleInput.trim() ? assignmentStatusInput : 'unassigned',
      };

      await updateDoc(doc(db, 'bookings', selectedBooking.id), payload);
      setSelectedBooking(null);
      showNotice('success', 'تم حفظ التسعير والتخصيص التشغيلي للمركبة بنجاح.');
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        showNotice('error', 'تعذر الحفظ في وضع عدم الاتصال.');
      } else {
        showNotice('error', 'حدث خطأ أثناء حفظ البيانات.');
        try {
          handleFirestoreError(error, OperationType.UPDATE, `bookings/${selectedBooking.id}`);
        } catch {
          // Logged
        }
      }
    }
  };

  const resetRuleForm = () => {
    setEditingRuleId(null);
    setRuleRouteName('');
    setRuleOrigin('');
    setRuleDestination('');
    setRuleSedanPrice('');
    setRuleSuvPrice('');
    setRuleMiniVanPrice('');
    setRuleMiniVanPremiumPrice('');
    setRuleIsActive(true);
    setRuleNotes('');
  };

  const startEditRule = (rule: PricingRule) => {
    setEditingRuleId(rule.id);
    setRuleRouteName(rule.routeName);
    setRuleOrigin(rule.origin || '');
    setRuleDestination(rule.destination || '');
    setRuleSedanPrice(rule.sedanPrice != null ? String(rule.sedanPrice) : '');
    setRuleSuvPrice(rule.suvPrice != null ? String(rule.suvPrice) : '');
    setRuleMiniVanPrice(rule.miniVanPrice != null ? String(rule.miniVanPrice) : '');
    setRuleMiniVanPremiumPrice(rule.miniVanPremiumPrice != null ? String(rule.miniVanPremiumPrice) : '');
    setRuleIsActive(rule.isActive !== false);
    setRuleNotes(rule.notes || '');
  };

  const handleSavePricingRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleOrigin.trim() || !ruleDestination.trim()) return;

    const parsedSedan = ruleSedanPrice.trim() ? Number(ruleSedanPrice) : null;
    const parsedSuv = ruleSuvPrice.trim() ? Number(ruleSuvPrice) : null;
    const parsedMiniVan = ruleMiniVanPrice.trim() ? Number(ruleMiniVanPrice) : null;
    const parsedMiniVanPremium = ruleMiniVanPremiumPrice.trim() ? Number(ruleMiniVanPremiumPrice) : null;
    const targetId = editingRuleId || `route-${Date.now()}`;
    const existingRule = structuredRules.find((r) => r.id === targetId);

    const updatedRule: PricingRule = {
      id: targetId,
      serviceId: existingRule?.serviceId || services[0]?.id || 'custom-route',
      vehicleCategoryId: existingRule?.vehicleCategoryId || 'sedan-luxury',
      routeName: ruleRouteName.trim() || `${ruleOrigin.trim()} ↔ ${ruleDestination.trim()}`,
      origin: ruleOrigin.trim(),
      destination: ruleDestination.trim(),
      sedanPrice: parsedSedan && parsedSedan > 0 ? parsedSedan : null,
      suvPrice: parsedSuv && parsedSuv > 0 ? parsedSuv : null,
      miniVanPrice: parsedMiniVan && parsedMiniVan > 0 ? parsedMiniVan : null,
      miniVanPremiumPrice: parsedMiniVanPremium && parsedMiniVanPremium > 0 ? parsedMiniVanPremium : null,
      baseRate: parsedSedan && parsedSedan > 0 ? parsedSedan : parsedSuv || 0,
      isActive: ruleIsActive,
      bidirectional: true,
      notes: ruleNotes.trim(),
    };

    try {
      await setDoc(doc(db, 'pricingRules', targetId), updatedRule, { merge: true });
      const nextList = editingRuleId
        ? structuredRules.map((r) => (r.id === targetId ? updatedRule : r))
        : [...structuredRules, updatedRule];
      onPricingRulesUpdated?.(nextList);
      resetRuleForm();
      showNotice('success', editingRuleId ? 'تم تحديث قاعدة المسار بنجاح.' : 'تمت إضافة قاعدة المسار بنجاح.');
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        showNotice('error', 'تعذر حفظ القاعدة في وضع عدم الاتصال.');
      } else {
        showNotice('error', 'حدث خطأ أثناء حفظ قاعدة التسعير.');
        try {
          handleFirestoreError(error, OperationType.WRITE, `pricingRules/${targetId}`);
        } catch {
          // Logged
        }
      }
    }
  };

  const handleToggleRuleActive = async (rule: PricingRule) => {
    const nextRule: PricingRule = { ...rule, isActive: rule.isActive === false };
    try {
      await setDoc(doc(db, 'pricingRules', rule.id), nextRule, { merge: true });
      onPricingRulesUpdated?.(structuredRules.map((r) => (r.id === rule.id ? nextRule : r)));
      showNotice('success', nextRule.isActive ? 'تم تفعيل تسعير المسار.' : 'تم إيقاف تسعير المسار.');
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        showNotice('error', 'تعذر التحديث في وضع عدم الاتصال.');
      } else {
        showNotice('error', 'تعذر تغيير حالة التفعيل.');
      }
    }
  };

  const handleDeletePricingRule = async (ruleId: string) => {
    try {
      await deleteDoc(doc(db, 'pricingRules', ruleId));
      setConfirmDeleteRuleId(null);
      onPricingRulesUpdated?.(structuredRules.filter((r) => r.id !== ruleId));
      showNotice('success', 'تم حذف قاعدة المسار بنجاح.');
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        showNotice('error', 'تعذر الحذف في وضع عدم الاتصال.');
      } else {
        showNotice('error', 'حدث خطأ أثناء حذف القاعدة.');
        try {
          handleFirestoreError(error, OperationType.DELETE, `pricingRules/${ruleId}`);
        } catch {
          // Logged
        }
      }
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((acc, b) => acc + (b.finalAgreedPrice || b.estimatedPrice || 0), 0);

  const selectedBookingCategoryKey = selectedBooking ? resolveBookingCategoryKey(selectedBooking) : 'sedan_comfort';
  const selectedBookingPool = INTERNAL_ASSIGNMENT_POOLS[selectedBookingCategoryKey] || [];

  return (
    <div className="min-h-screen bg-[#101D2D] text-[#F6F5F1] py-8 sm:py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#C9A96B]/20 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#C9A96B] font-label mb-1.5">
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span>لوحة التشغيل التنفيذي</span>
            </div>
            <h1 className="font-page-title text-white">إدارة التشغيل والتسعير - الوكيل ليموزين</h1>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4">
            <div className="bg-[#152438] border border-[#C9A96B]/20 px-4 sm:px-5 py-3 rounded-xl text-center shadow-lg">
              <span className="font-label text-[#9A9A96] block mb-0.5">إجمالي الطلبات</span>
              <span className="text-lg sm:text-xl font-bold text-white tabular-nums">{bookings.length}</span>
            </div>
            <div className="bg-[#152438] border border-[#C9A96B]/20 px-4 sm:px-5 py-3 rounded-xl text-center shadow-lg">
              <span className="font-label text-[#9A9A96] block mb-0.5">العائد المتوقع / المحصل</span>
              <span className="text-lg sm:text-xl font-bold text-[#C9A96B] tabular-nums">{totalRevenue} ج.م</span>
            </div>
          </div>
        </div>

        {offlineNotice && (
          <div className="bg-[#152438] border border-[#C9A96B]/30 rounded-2xl p-4 flex items-center gap-3 text-sm text-[#C9A96B]">
            <WifiOff className="w-5 h-5 shrink-0" />
            <span className="font-sub">الاتصال بالخادم غير متوفر حالياً. يتم عرض البيانات المتاحة محلياً.</span>
          </div>
        )}

        {feedback && (
          <div
            className={`rounded-2xl p-4 font-sub border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-[#C9A96B]/20 pb-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'bookings' ? 'bg-[#C9A96B] text-[#101D2D] shadow-xl' : 'bg-[#152438] text-[#9A9A96] hover:text-white border border-[#C9A96B]/20'
            }`}
          >
            إدارة الطلبات والتخصيص ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'pricing' ? 'bg-[#C9A96B] text-[#101D2D] shadow-xl' : 'bg-[#152438] text-[#9A9A96] hover:text-white border border-[#C9A96B]/20'
            }`}
          >
            إدارة تسعير المسارات ({structuredRules.length})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'fleet' ? 'bg-[#C9A96B] text-[#101D2D] shadow-xl' : 'bg-[#152438] text-[#9A9A96] hover:text-white border border-[#C9A96B]/20'
            }`}
          >
            الأسطول الداخلي وفئات الخدمة ({vehicles.length})
          </button>
        </div>

        {/* Tab 1: Bookings Management + Internal Vehicle Assignment */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20 font-body text-[#9A9A96]">جاري تحميل الطلبات...</div>
            ) : bookings.length === 0 ? (
              <div className="bg-[#152438] border border-[#C9A96B]/20 p-14 text-center rounded-3xl font-body text-[#9A9A96] shadow-xl">
                لا توجد طلبات حجز مسجلة حتى الآن.
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const categoryKey = resolveBookingCategoryKey(booking);
                  const categoryLabel = booking.serviceCategoryLabel || SERVICE_CATEGORIES[categoryKey].fullLabelAr;
                  return (
                    <div key={booking.id} className="bg-[#152438] border border-[#C9A96B]/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-right">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9A96B]/20 pb-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs bg-[#101D2D] px-2.5 py-1 rounded-lg text-[#C9A96B] font-mono border border-[#C9A96B]/20">
                              #{booking.id.slice(0, 8)}
                            </span>
                            <span className="text-xs bg-[#C9A96B]/15 text-[#DFC89B] px-2.5 py-1 rounded-lg border border-[#C9A96B]/30">
                              {categoryLabel}
                            </span>
                            <span className="font-sub text-[#9A9A96]">{new Date(booking.createdAt).toLocaleString()}</span>
                          </div>
                          <h3 className="font-card-heading text-white">
                            {booking.pickupLocation} ← {booking.dropoffLocation} ({booking.customerName})
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={booking.status}
                            onChange={(e) => handleUpdateStatus(booking.id, e.target.value as BookingStatus)}
                            className="bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2 text-xs text-[#C9A96B] font-semibold focus:outline-none"
                          >
                            <option value="pending_review">قيد المراجعة</option>
                            <option value="quote_provided">تم تقديم عرض سعر</option>
                            <option value="pending_customer_approval">في انتظار موافقة العميل</option>
                            <option value="confirmed">حجز مؤكد (تنسيق هاتفي)</option>
                            <option value="in_progress">قيد التنفيذ</option>
                            <option value="completed">مكتمل (تم الدفع نقداً)</option>
                            <option value="cancelled">ملغى</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-sm">
                        <div>
                          <span className="font-label text-[#9A9A96] block mb-1">بيانات العميل:</span>
                          <p className="font-bold text-white">{booking.customerName}</p>
                          <p className="text-[#C9A96B]" dir="ltr">{booking.customerPhone}</p>
                        </div>

                        <div>
                          <span className="font-label text-[#9A9A96] block mb-1">تفاصيل الرحلة:</span>
                          <p className="text-[#F6F5F1]/90" dir="ltr">{booking.pickupDateTime.replace('T', ' ')}</p>
                          <p className="font-sub text-[#9A9A96]">
                            ركاب: {booking.passengersCount} | حقائب: {booking.luggageCount}
                          </p>
                        </div>

                        <div className="bg-[#101D2D] p-4 rounded-2xl border border-[#C9A96B]/20 space-y-1">
                          <span className="font-label text-[#9A9A96] block">التخصيص التشغيلي الداخلي:</span>
                          <p className="font-medium text-white">
                            {booking.assignedVehicleModel || 'لم يتم تعيين سيارة بعد'}
                          </p>
                          {booking.assignedDriverName && (
                            <p className="font-sub text-[#91B9C8]">السائق: {booking.assignedDriverName}</p>
                          )}
                          <span className={`inline-block text-[11px] font-medium ${booking.assignmentStatus === 'assigned' ? 'text-emerald-400' : 'text-[#C9A96B]'}`}>
                            {booking.assignmentStatus === 'assigned' ? 'تم التخصيص' : 'قيد التخصيص'}
                          </span>
                        </div>

                        <div className="bg-[#101D2D] p-4 rounded-2xl border border-[#C9A96B]/20 flex flex-col justify-between">
                          <div>
                            <span className="font-label text-[#9A9A96] block mb-1">التسعير:</span>
                            <span className="font-sub text-slate-300">
                              {booking.pricingType === 'quote_required' || booking.estimatedPrice === 0
                                ? 'عرض سعر خاص'
                                : `مبدئي: ${booking.estimatedPrice} ج.م`}
                            </span>
                            {booking.finalAgreedPrice !== undefined && (
                              <span className="text-[#C9A96B] font-bold block mt-1">مؤكد: {booking.finalAgreedPrice} ج.م</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setFinalPriceInput(booking.finalAgreedPrice || booking.estimatedPrice || 0);
                              setPriceNotesInput(booking.priceNotes || '');
                              setAssignedVehicleInput(booking.assignedVehicleModel || '');
                              setAssignedDriverInput(booking.assignedDriverName || '');
                              setAssignmentStatusInput(booking.assignmentStatus || 'assigned');
                            }}
                            className="mt-3 bg-[#C9A96B]/10 hover:bg-[#C9A96B]/20 text-[#C9A96B] border border-[#C9A96B]/30 text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
                          >
                            <Car className="w-3.5 h-3.5" />
                            <span>التسعير وتخصيص السيارة</span>
                          </button>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="bg-[#101D2D] p-4 rounded-2xl border border-[#C9A96B]/20 font-sub text-[#F6F5F1]/90">
                          <span className="font-bold text-[#C9A96B] block mb-1">ملاحظات العميل: </span>
                          <p>{booking.notes}</p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Administrator Route Pricing Configuration */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="bg-[#152438] border border-[#C9A96B]/20 rounded-3xl p-6 sm:p-8 space-y-5 text-right shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-card-heading text-white flex items-center gap-2.5">
                  <Plus className="w-5 h-5 text-[#C9A96B]" />
                  <span>{editingRuleId ? 'تعديل تسعير المسار' : 'إضافة مسار وتسعير جديد'}</span>
                </h3>
                {editingRuleId && (
                  <button
                    type="button"
                    onClick={resetRuleForm}
                    className="text-xs text-[#91B9C8] hover:text-white"
                  >
                    إلغاء التعديل
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePricingRule} className="space-y-4">
                <div>
                  <label className="block font-label text-[#9A9A96] mb-1.5">اسم المسار</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الإسكندرية ↔ مطار برج العرب الدولي"
                    value={ruleRouteName}
                    onChange={(e) => setRuleRouteName(e.target.value)}
                    className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-label text-[#9A9A96] mb-1.5">نقطة الانطلاق</label>
                    <input
                      type="text"
                      required
                      placeholder="الإسكندرية"
                      value={ruleOrigin}
                      onChange={(e) => setRuleOrigin(e.target.value)}
                      className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[#9A9A96] mb-1.5">الوجهة</label>
                    <input
                      type="text"
                      required
                      placeholder="مطار برج العرب الدولي"
                      value={ruleDestination}
                      onChange={(e) => setRuleDestination(e.target.value)}
                      className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-label text-[#9A9A96] mb-1.5 text-xs">سعر سيدان (ج.م)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="850"
                      value={ruleSedanPrice}
                      onChange={(e) => setRuleSedanPrice(e.target.value)}
                      className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-3 py-2 text-sm text-white focus:border-[#C9A96B]"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[#9A9A96] mb-1.5 text-xs">سعر SUV (ج.م)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="1200"
                      value={ruleSuvPrice}
                      onChange={(e) => setRuleSuvPrice(e.target.value)}
                      className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-3 py-2 text-sm text-white focus:border-[#C9A96B]"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[#9A9A96] mb-1.5 text-xs">سعر ميني فان (ج.م)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="غير محدد"
                      value={ruleMiniVanPrice}
                      onChange={(e) => setRuleMiniVanPrice(e.target.value)}
                      className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-3 py-2 text-sm text-white focus:border-[#C9A96B]"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[#9A9A96] mb-1.5 text-xs">ميني فان بريميوم (ج.م)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="غير محدد"
                      value={ruleMiniVanPremiumPrice}
                      onChange={(e) => setRuleMiniVanPremiumPrice(e.target.value)}
                      className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-3 py-2 text-sm text-white focus:border-[#C9A96B]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer font-sub text-[#F6F5F1]">
                  <input
                    type="checkbox"
                    checked={ruleIsActive}
                    onChange={(e) => setRuleIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#C9A96B]"
                  />
                  <span>تفعيل التسعير التلقائي لهذا المسار (بالاتجاهين)</span>
                </label>

                <div>
                  <label className="block font-label text-[#9A9A96] mb-1.5">ملاحظات المسار</label>
                  <textarea
                    rows={2}
                    placeholder="ملاحظات تشغيلية..."
                    value={ruleNotes}
                    onChange={(e) => setRuleNotes(e.target.value)}
                    className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl p-3 text-sm text-white focus:border-[#C9A96B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold py-3 rounded-xl shadow-lg text-sm"
                >
                  {editingRuleId ? 'حفظ التعديلات' : 'حفظ وإضافة المسار'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-card-heading text-white mb-2">جدول تسعير المسارات المعتمد</h3>
              <div className="grid grid-cols-1 gap-4">
                {structuredRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-[#152438] border border-[#C9A96B]/20 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-subheading text-white">{rule.routeName}</h4>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-md border ${
                              rule.isActive !== false
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-red-500/10 text-red-300 border-red-500/30'
                            }`}
                          >
                            {rule.isActive !== false ? 'مفعل' : 'معطل'}
                          </span>
                        </div>
                        <p className="font-sub text-[#91B9C8]">
                          {rule.origin} ↔ {rule.destination}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleToggleRuleActive(rule)}
                          className="px-3 py-1.5 rounded-lg bg-[#101D2D] border border-[#C9A96B]/25 text-xs text-[#DFC89B] hover:border-[#C9A96B]"
                        >
                          {rule.isActive !== false ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditRule(rule)}
                          className="p-2 rounded-xl bg-[#101D2D] border border-[#C9A96B]/25 text-[#C9A96B] hover:text-white"
                          title="تعديل الأسعار"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {confirmDeleteRuleId === rule.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeletePricingRule(rule.id)}
                              className="bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                            >
                              تأكيد
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteRuleId(null)}
                              className="bg-[#101D2D] text-[#9A9A96] px-2 py-1.5 rounded-lg text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteRuleId(rule.id)}
                            className="p-2 rounded-xl bg-[#101D2D] border border-[#C9A96B]/20 text-slate-400 hover:text-red-400"
                            title="حذف المسار"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#C9A96B]/15 font-sub tabular-nums">
                      <div className="bg-[#101D2D] rounded-xl p-3">
                        <span className="text-[#9A9A96] block text-xs">سيدان مريحة</span>
                        <span className="text-[#C9A96B] font-bold">
                          {rule.sedanPrice ? `${rule.sedanPrice.toLocaleString('en-US')} ج.م` : 'غير محدد'}
                        </span>
                      </div>
                      <div className="bg-[#101D2D] rounded-xl p-3">
                        <span className="text-[#9A9A96] block text-xs">SUV بريميوم</span>
                        <span className="text-[#C9A96B] font-bold">
                          {rule.suvPrice ? `${rule.suvPrice.toLocaleString('en-US')} ج.م` : 'غير محدد'}
                        </span>
                      </div>
                      <div className="bg-[#101D2D] rounded-xl p-3">
                        <span className="text-[#9A9A96] block text-xs">ميني فان (4–5 ركاب)</span>
                        <span className={rule.miniVanPrice ? 'text-[#C9A96B] font-bold' : 'text-[#91B9C8]'}>
                          {rule.miniVanPrice ? `${rule.miniVanPrice.toLocaleString('en-US')} ج.م` : 'يتطلب إعداد'}
                        </span>
                      </div>
                      <div className="bg-[#101D2D] rounded-xl p-3">
                        <span className="text-[#9A9A96] block text-xs">ميني فان بريميوم (Carnival)</span>
                        <span className={rule.miniVanPremiumPrice ? 'text-[#C9A96B] font-bold' : 'text-[#91B9C8]'}>
                          {rule.miniVanPremiumPrice ? `${rule.miniVanPremiumPrice.toLocaleString('en-US')} ج.م` : 'يتطلب إعداد'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Internal Fleet Reference */}
        {activeTab === 'fleet' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-section-heading text-white">موديلات الأسطول الداخلي للتخصيص التشغيلي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {VERIFIED_FLEET_MODELS.map((m) => (
                  <div key={m.id} className="bg-[#152438] border border-[#C9A96B]/20 rounded-2xl overflow-hidden shadow-xl">
                    <div className="aspect-video w-full overflow-hidden bg-[#0B1522]">
                      <SafeImage
                        src={m.imageUrl}
                        alt={`${m.nameAr} (${m.nameEn})`}
                        unavailableTextAr={m.imageUnavailableReasonAr}
                        variant={
                          m.id === 'toyota-hiace-m55'
                            ? 'hiace'
                            : m.id === 'kia-carnival'
                              ? 'carnival'
                              : m.id === 'kia-sportage'
                                ? 'sportage'
                                : m.group === 'mini-van'
                                  ? 'van'
                                  : m.group === 'suv-family'
                                    ? 'suv'
                                    : 'sedan'
                        }
                        width={1000}
                        height={558}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90"
                      />
                    </div>
                    <div className="p-4 sm:p-5 space-y-2.5 text-right">
                      <div>
                        <h4 className="font-card-heading text-white">{m.nameAr}</h4>
                        <p className="text-xs text-[#9A9A96]" dir="ltr">{m.nameEn}</p>
                      </div>
                      <div className="flex items-center gap-2 font-label">
                        {m.colorConfirmed && m.colorSwatchHex ? (
                          <>
                            <span
                              className="w-3 h-3 rounded-full border border-[#C9A96B]/60 shrink-0"
                              style={{ backgroundColor: m.colorSwatchHex }}
                              aria-hidden="true"
                            />
                            <span className="text-[#DFC89B] font-medium">اللون المؤكد: {m.colorLabelAr}</span>
                          </>
                        ) : (
                          <span className="text-[#9A9A96]">{m.colorLabelAr}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-[#C9A96B]/15 font-label text-[#C9A96B] tabular-nums">
                        <span>{m.passengers} ركاب</span>
                        <span className="w-px h-3.5 bg-[#C9A96B]/30" aria-hidden="true" />
                        <span>{m.luggage} حقائب</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Pricing & Internal Vehicle Assignment Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1522]/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#152438] border border-[#C9A96B]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-right shadow-2xl text-[#F6F5F1] my-6">
            <div>
              <h3 className="font-card-heading text-white">التسعير النهائي والتخصيص الداخلي للمركبة</h3>
              <p className="font-sub text-[#91B9C8] mt-1">
                الفئة المطلوبة: {SERVICE_CATEGORIES[selectedBookingCategoryKey].fullLabelAr}
              </p>
            </div>
            
            <form onSubmit={handleSaveBookingManagement} className="space-y-4">
              <div>
                <label className="block font-label text-[#9A9A96] mb-1.5">
                  تعيين المركبة من أسطول التشغيل (داخلي)
                </label>
                <select
                  value={selectedBookingPool.includes(assignedVehicleInput) ? assignedVehicleInput : ''}
                  onChange={(e) => {
                    setAssignedVehicleInput(e.target.value);
                    if (e.target.value) setAssignmentStatusInput('assigned');
                  }}
                  className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                >
                  <option value="">-- اختر من قائمة الفئة المعتمدة --</option>
                  {selectedBookingPool.map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="أو أدخل اسم المركبة / رقم اللوحة يدوياً..."
                  value={assignedVehicleInput}
                  onChange={(e) => setAssignedVehicleInput(e.target.value)}
                  className="mt-2 w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-label text-[#9A9A96] mb-1.5">اسم السائق المعين</label>
                  <input
                    type="text"
                    placeholder="اسم الكابتن..."
                    value={assignedDriverInput}
                    onChange={(e) => setAssignedDriverInput(e.target.value)}
                    className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                  />
                </div>
                <div>
                  <label className="block font-label text-[#9A9A96] mb-1.5">حالة التخصيص</label>
                  <select
                    value={assignmentStatusInput}
                    onChange={(e) => setAssignmentStatusInput(e.target.value as 'unassigned' | 'assigned')}
                    className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                  >
                    <option value="unassigned">غير معين بعد</option>
                    <option value="assigned">تم التخصيص والتأكيد</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label text-[#9A9A96] mb-1.5">السعر النهائي المعتمد (ج.م)</label>
                <input
                  type="number"
                  required
                  value={finalPriceInput}
                  onChange={(e) => setFinalPriceInput(Number(e.target.value))}
                  className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B]"
                />
              </div>

              <div>
                <label className="block font-label text-[#9A9A96] mb-1.5">ملاحظات السعر والخدمة (تظهر للعميل)</label>
                <textarea
                  rows={2}
                  value={priceNotesInput}
                  onChange={(e) => setPriceNotesInput(e.target.value)}
                  placeholder="ملاحظات إضافية للعميل..."
                  className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl p-3 text-sm text-white focus:border-[#C9A96B]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#101D2D] text-[#9A9A96] text-sm border border-[#C9A96B]/20"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
