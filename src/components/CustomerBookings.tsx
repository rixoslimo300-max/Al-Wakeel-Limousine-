import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import {
  db,
  auth,
  collection,
  query,
  where,
  onSnapshot,
  OperationType,
  handleFirestoreError,
  isOfflineOrNetworkError
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Calendar, MapPin, Phone, Clock, CheckCircle, AlertCircle, RefreshCw, DollarSign, User as UserIcon, WifiOff } from 'lucide-react';

interface CustomerBookingsProps {
  onOpenBooking: () => void;
}

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({ onOpenBooking }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineNotice, setOfflineNotice] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    try {
      const q = query(
        collection(db, 'bookings'),
        where('customerId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          clearTimeout(timer);
          setOfflineNotice(false);
          const list: Booking[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
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
    } catch (error) {
      clearTimeout(timer);
      if (isOfflineOrNetworkError(error)) {
        setOfflineNotice(true);
      }
      setLoading(false);
    }
  }, [user]);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending_review':
        return <span className="bg-[#C6A66B]/10 text-[#C6A66B] border border-[#C6A66B]/30 px-3 py-1 rounded-lg font-label inline-flex items-center gap-1.5 whitespace-nowrap"><Clock className="w-3.5 h-3.5 shrink-0" /> قيد المراجعة والتحقق</span>;
      case 'quote_provided':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg font-label inline-flex items-center gap-1.5 whitespace-nowrap"><DollarSign className="w-3.5 h-3.5 shrink-0" /> تم إصدار عرض السعر</span>;
      case 'pending_customer_approval':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-lg font-label inline-flex items-center gap-1.5 whitespace-nowrap"><RefreshCw className="w-3.5 h-3.5 shrink-0" /> بانتظار موافقة العميل</span>;
      case 'confirmed':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-label inline-flex items-center gap-1.5 whitespace-nowrap"><CheckCircle className="w-3.5 h-3.5 shrink-0" /> حجز مؤكد هاتفياً</span>;
      case 'in_progress':
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg font-label inline-flex items-center gap-1.5 whitespace-nowrap"><RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin" /> الرحلة قيد التنفيذ حالياً</span>;
      case 'completed':
        return <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-lg font-label inline-flex items-center gap-1.5 whitespace-nowrap"><CheckCircle className="w-3.5 h-3.5 shrink-0" /> رحلة مكتملة (تم الدفع)</span>;
      case 'cancelled':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg font-label inline-flex items-center gap-1.5 whitespace-nowrap"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> ملغى</span>;
      default:
        return <span className="bg-[#101B2A] text-[#9A9A96] px-3 py-1 rounded-lg font-label">{status}</span>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5 py-6 bg-[#101B2A] text-[#F5F1E9]">
        <div className="bg-[#17283D] border border-[#C6A66B]/30 p-8 sm:p-10 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <UserIcon className="w-12 h-12 text-[#C6A66B] mx-auto" />
          <h2 className="font-section-heading text-white">يرجى تسجيل الدخول لعرض حجوزاتك</h2>
          <p className="font-body text-[#9A9A96]">
            يمكنك تسجيل الدخول باستخدام حساب جوجل الخاص بك لمتابعة حالة طلبات الحجز وعروض الأسعار بدقة.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101B2A] text-[#F5F1E9] py-8 sm:py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#C6A66B]/20 pb-5">
          <div>
            <h1 className="font-page-title text-white">سجل الحجوزات ومتابعة التنفيذ</h1>
            <p className="font-body text-[#9A9A96] mt-1">تتبع حالة طلبات النقل الخاصة بك وتفاصيل الأسعار المؤكدة هاتفياً.</p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="min-h-[44px] bg-gradient-to-r from-[#C6A66B] to-[#B08E4F] hover:from-[#d2b376] text-[#101B2A] font-bold px-5 py-2.5 rounded-xl shadow-lg text-sm self-start sm:self-auto whitespace-nowrap"
          >
            + طلب حجز جديد
          </button>
        </div>

        {offlineNotice && (
          <div className="bg-[#17283D] border border-[#C6A66B]/30 rounded-2xl p-4 flex items-center gap-3 text-sm text-[#C6A66B]">
            <WifiOff className="w-5 h-5 shrink-0" />
            <span className="font-sub">يتم عرض البيانات المحفوظة محلياً نظراً لعدم توفر اتصال مباشر بالخادم حالياً.</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 font-body text-[#9A9A96]">جاري تحميل الحجوزات...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#17283D] border border-[#C6A66B]/20 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-2xl">
            <Calendar className="w-14 h-14 text-[#C6A66B]/60 mx-auto" />
            <h3 className="font-section-heading text-white">لا توجد حجوزات سابقة</h3>
            <p className="font-body text-[#9A9A96] max-w-md mx-auto">
              لم تقم بتقديم أي طلبات حجز بعد. ابدأ الآن باختيار خدمتك المفضلة وتقديم طلب الحجز الخاص بك.
            </p>
            <button
              onClick={onOpenBooking}
              className="bg-[#C6A66B] hover:bg-[#d2b376] text-[#101B2A] font-bold px-7 py-3 rounded-xl text-sm transition-colors"
            >
              احجز رحلتك الأولى
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#17283D] border border-[#C6A66B]/20 hover:border-[#C6A66B]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C6A66B]/20 pb-4">
                  <div>
                    <span className="font-label text-[#9A9A96] block mb-1 font-mono">رقم الطلب: #{booking.id.slice(0, 8)}</span>
                    <h3 className="font-card-heading text-white">{booking.serviceCategoryLabel || booking.serviceName}</h3>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 text-[#F5F1E9]/90">
                      <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-1" />
                      <div>
                        <span className="font-label text-[#9A9A96] block">نقطة الانطلاق:</span>
                        <span className="font-medium text-white">{booking.pickupLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-[#F5F1E9]/90">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <span className="font-label text-[#9A9A96] block">وجهة الوصول:</span>
                        <span className="font-medium text-white">{booking.dropoffLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 text-[#F5F1E9]/90">
                      <Calendar className="w-4 h-4 text-[#C6A66B] shrink-0 mt-1" />
                      <div>
                        <span className="font-label text-[#9A9A96] block">موعد الرحلة وتوقيتها:</span>
                        <span className="font-medium text-white" dir="ltr">{booking.pickupDateTime.replace('T', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-[#F5F1E9]/90">
                      <Phone className="w-4 h-4 text-[#C6A66B] shrink-0 mt-1" />
                      <div>
                        <span className="font-label text-[#9A9A96] block">رقم الهاتف المحمول:</span>
                        <span className="font-medium text-white" dir="ltr">{booking.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#101B2A] p-4 sm:p-5 rounded-xl border border-[#C6A66B]/20 space-y-2.5 flex flex-col justify-center">
                    <div className="flex justify-between font-sub">
                      <span className="text-[#9A9A96]">قيمة الرحلة:</span>
                      {booking.pricingType === 'quote_required' || booking.estimatedPrice === 0 ? (
                        <span className="font-semibold text-[#C6A66B]">عرض سعر خاص</span>
                      ) : (
                        <span className="font-bold text-slate-200 tabular-nums">{booking.estimatedPrice} ج.م</span>
                      )}
                    </div>
                    {booking.finalAgreedPrice !== undefined && (
                      <div className="flex justify-between text-sm pt-2.5 border-t border-[#C6A66B]/20">
                        <span className="text-[#C6A66B] font-bold">السعر النهائي المؤكد:</span>
                        <span className="font-bold text-[#C6A66B] tabular-nums">{booking.finalAgreedPrice} ج.م</span>
                      </div>
                    )}
                    {booking.assignmentStatus === 'assigned' && booking.status === 'confirmed' && booking.assignedVehicleModel && (
                      <div className="flex justify-between font-sub pt-2 border-t border-[#C6A66B]/15">
                        <span className="text-[#9A9A96]">المركبة المعتمدة:</span>
                        <span className="text-white font-medium" dir="ltr">{booking.assignedVehicleModel}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-sub pt-1">
                      <span className="text-[#9A9A96]">حالة الدفع:</span>
                      <span className="text-[#C6A66B] font-medium">
                        {booking.paymentStatus === 'cash_collected' ? 'تم الدفع' : 'نقداً عند الركوب'}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.priceNotes && (
                  <div className="bg-[#C6A66B]/10 border border-[#C6A66B]/30 p-4 rounded-2xl font-sub text-[#C6A66B]">
                    <span className="font-bold block mb-1">ملاحظات الإدارة / السعر:</span>
                    <p>{booking.priceNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
