import React, { useState, useEffect, useMemo } from 'react';
import { Service, PricingRule, ServiceCategoryKey } from '../types';
import { db, auth, signInAnonymously, collection, addDoc } from '../lib/firebase';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Briefcase,
  Phone,
  Building2,
  User as UserIcon,
  Plane,
  Car,
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Plus,
  Minus,
  Send,
  Info,
} from 'lucide-react';
import {
  DAILY_RENTAL_PACKAGES,
  OFFICIAL_TEL_HREF,
  OFFICIAL_WHATSAPP_NUMBER,
  QUOTE_REVIEW_MESSAGE_AR,
  SERVICE_CATEGORIES,
  VEHICLE_ALLOCATION_DISCLAIMER_AR,
  DailyRentalPackageId,
  allocateVehicleForTrip,
  getDailyRentalPackage,
  buildDailyRentalWhatsAppMessage,
  buildDailyRentalWhatsAppUrl,
  evaluateVehicleCapacity,
  getLocalDateInputValue,
} from '../lib/bookingEngine';
import { REPRESENTATIVE_IMAGES_BY_MODEL_ID } from '../data/verifiedFleet';
import {
  TRIP_TYPE_OPTIONS,
  BOOKING_PREPARED_INSTRUCTION_AR,
  BOOKING_OPEN_FAILED_INSTRUCTION_AR,
  WHATSAPP_COMPANY_PHONE_DISPLAY,
  WhatsAppBookingFormData,
  BookingValidationErrors,
  TripTypeOption,
  computeBookingPricingSummary,
  hasConfirmedPaxAndLuggage,
  isCoreOutboundTripReady,
  normalizeTripType,
  validateSectionA,
  validateSectionB,
  validateSectionC,
  validateWhatsAppBookingForm,
  buildStructuredWhatsAppBookingMessage,
  buildWhatsAppClickToChatUrl,
  buildWhatsAppWebFallbackUrl,
  openWhatsAppSafely,
  formatReadableDate,
  formatReadableTime,
  inferTripTypeFromRoute,
  parseStrictInt,
} from '../lib/whatsappBooking';

export type BookingFlowMode = 'transfer' | 'daily_rental';
type WizardStep = 1 | 2 | 3;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  pricingRules: PricingRule[];
  initialBookingMode?: BookingFlowMode;
  preselectedDailyPackageId?: DailyRentalPackageId | null;
  preselectedOrigin?: string | null;
  preselectedDestination?: string | null;
  preselectedDate?: string | null;
  preselectedTime?: string | null;
  preselectedPassengers?: number | null;
  preselectedCategory?: ServiceCategoryKey | null;
  preselectedService?: Service | null;
  openedFromQuickBar?: boolean;
  openTriggerNonce?: number;
  returnToStepAfterEdit?: WizardStep | null;
  onClearReturnStep?: () => void;
  onEditPassengersAtEntry?: (fromStep: 2 | 3) => void;
  onBookingSubmitted?: () => void;
}

const DRAFT_STORAGE_KEY = 'alwakeel_booking_draft_v4';

const QUICK_LOCATIONS = [
  'الإسكندرية',
  'مطار برج العرب الدولي',
  'مطار القاهرة الدولي',
  'مطار سفنكس الدولي',
  'الساحل الشمالي / مارينا',
];

const DEFAULT_FORM_DATA: WhatsAppBookingFormData = {
  tripType: 'توصيل إلى المطار',
  pickupLocation: 'الإسكندرية',
  dropoffLocation: 'مطار برج العرب الدولي',
  tripDate: '',
  tripTime: '',
  airline: '',
  flightNumber: '',
  actualArrivalTime: '',
  hasReturnTrip: false,
  returnDate: '',
  returnTime: '',
  returnPickupLocation: '',
  returnDropoffLocation: '',
  returnUseDifferentCategory: false,
  returnServiceCategory: null,
  passengersCount: '',
  passengersFromQuickBar: false,
  luggageCount: '',
  serviceCategory: null,
  fullName: '',
  phone: '',
  companyName: '',
  notes: '',
};

function sanitizeIntegerInput(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

function loadSessionDraft(): { formData: WhatsAppBookingFormData; step: WizardStep } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      formData?: Partial<WhatsAppBookingFormData>;
      step?: number;
    };
    if (!parsed || !parsed.formData) return null;

    const merged: WhatsAppBookingFormData = {
      ...DEFAULT_FORM_DATA,
      ...parsed.formData,
      tripType: normalizeTripType(parsed.formData.tripType),
      passengersCount:
        typeof parsed.formData.passengersCount === 'string'
          ? sanitizeIntegerInput(parsed.formData.passengersCount)
          : '',
      passengersFromQuickBar: Boolean(parsed.formData.passengersFromQuickBar),
      luggageCount:
        typeof parsed.formData.luggageCount === 'string'
          ? sanitizeIntegerInput(parsed.formData.luggageCount)
          : '',
    };

    const { confirmed, passengersCount, luggageCount } = hasConfirmedPaxAndLuggage(merged);
    if (confirmed && passengersCount !== null && luggageCount !== null) {
      const enforced = evaluateVehicleCapacity({
        passengersCount,
        luggageCount,
        preferredCategory: merged.serviceCategory,
      });
      merged.serviceCategory = enforced.effectiveCategory;

      const returnEnforced = evaluateVehicleCapacity({
        passengersCount,
        luggageCount,
        preferredCategory: merged.returnServiceCategory,
      });
      merged.returnServiceCategory = returnEnforced.effectiveCategory;
    }

    const validStep: WizardStep =
      parsed.step && [1, 2, 3].includes(parsed.step) ? (parsed.step as WizardStep) : 1;

    return { formData: merged, step: validStep };
  } catch {
    return null;
  }
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  pricingRules,
  initialBookingMode = 'transfer',
  preselectedDailyPackageId,
  preselectedOrigin,
  preselectedDestination,
  preselectedDate,
  preselectedTime,
  preselectedPassengers,
  preselectedCategory,
  openedFromQuickBar = false,
  openTriggerNonce = 0,
  returnToStepAfterEdit = null,
  onClearReturnStep,
  onEditPassengersAtEntry,
  onBookingSubmitted,
}) => {
  const initialDraft = useMemo(() => loadSessionDraft(), []);

  const [bookingMode, setBookingMode] = useState<BookingFlowMode>(initialBookingMode);
  const [step, setStep] = useState<WizardStep>(initialDraft?.step || 1);
  const [formData, setFormData] = useState<WhatsAppBookingFormData>(
    initialDraft?.formData || DEFAULT_FORM_DATA
  );
  const [errors, setErrors] = useState<BookingValidationErrors>({});

  // Daily Rental State (preserved functional flow)
  const [dailyPackageId, setDailyPackageId] = useState<DailyRentalPackageId>('daily-rental-8h');
  const [dailyUsageDate, setDailyUsageDate] = useState<string>('');
  const [dailyStartTime, setDailyStartTime] = useState<string>('');
  const [dailyName, setDailyName] = useState<string>('');
  const [dailyPhone, setDailyPhone] = useState<string>('');
  const [dailyNotes, setDailyNotes] = useState<string>('');
  const [dailyErrors, setDailyErrors] = useState<Record<string, string>>({});
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  // Submission State (never clears customer data or fakes confirmation)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparedSubmission, setPreparedSubmission] = useState<{
    mode: BookingFlowMode;
    waUrl: string;
    waWebUrl: string;
    openedProgrammatically: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ formData, step }));
    } catch {
      // Ignore storage quota errors
    }
  }, [formData, step]);

  useEffect(() => {
    if (!isOpen) return;

    setBookingMode(initialBookingMode);
    setErrors({});
    setDailyErrors({});
    setConsentError(null);
    setPreparedSubmission(null);
    setIsSubmitting(false);

    const hasExplicitRoute = Boolean(preselectedOrigin || preselectedDestination);
    const hasExplicitPresets =
      hasExplicitRoute ||
      Boolean(preselectedDate) ||
      Boolean(preselectedTime) ||
      Boolean(preselectedPassengers) ||
      Boolean(preselectedCategory);

    if (openedFromQuickBar && returnToStepAfterEdit) {
      const nextStep: WizardStep =
        returnToStepAfterEdit === 3 &&
        isCoreOutboundTripReady(formData) &&
        parseStrictInt(formData.luggageCount) !== null
          ? 3
          : isCoreOutboundTripReady(formData)
            ? 2
            : 1;
      setStep(nextStep);
      onClearReturnStep?.();
    } else if (hasExplicitPresets) {
      setStep(1);
    }

    setFormData((prev) => {
      const nextOrigin = preselectedOrigin || prev.pickupLocation || 'الإسكندرية';
      const nextDest = preselectedDestination || prev.dropoffLocation || 'مطار برج العرب الدولي';
      const nextTripType = hasExplicitRoute
        ? inferTripTypeFromRoute(nextOrigin, nextDest)
        : prev.tripType;

      const nextFromQuickBar =
        openTriggerNonce > 0 ? Boolean(openedFromQuickBar) : Boolean(prev.passengersFromQuickBar);

      const nextPaxStr = openedFromQuickBar
        ? String(preselectedPassengers && preselectedPassengers >= 1 ? preselectedPassengers : 2)
        : prev.passengersCount;

      const paxNum = parseStrictInt(nextPaxStr);
      const bagsNum = parseStrictInt(prev.luggageCount);
      let nextCategory: ServiceCategoryKey | null =
        preselectedCategory ?? (openTriggerNonce > 0 && !openedFromQuickBar ? null : prev.serviceCategory);

      if (paxNum !== null && paxNum >= 1 && bagsNum !== null && bagsNum >= 0) {
        nextCategory = evaluateVehicleCapacity({
          passengersCount: paxNum,
          luggageCount: bagsNum,
          preferredCategory: nextCategory,
        }).effectiveCategory;
      }

      return {
        ...prev,
        tripType: nextTripType,
        pickupLocation: nextOrigin,
        dropoffLocation: nextDest,
        tripDate: preselectedDate || prev.tripDate,
        tripTime: preselectedTime || prev.tripTime,
        passengersCount: nextPaxStr,
        passengersFromQuickBar: nextFromQuickBar,
        serviceCategory: nextCategory,
      };
    });

    if (preselectedDailyPackageId) {
      setDailyPackageId(preselectedDailyPackageId);
    }
    if (preselectedDate) setDailyUsageDate(preselectedDate);
    if (preselectedTime) setDailyStartTime(preselectedTime);
  }, [
    isOpen,
    openTriggerNonce,
    openedFromQuickBar,
    returnToStepAfterEdit,
    initialBookingMode,
    preselectedDailyPackageId,
    preselectedOrigin,
    preselectedDestination,
    preselectedDate,
    preselectedTime,
    preselectedPassengers,
    preselectedCategory,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const pricingSummary = useMemo(
    () => computeBookingPricingSummary(formData, pricingRules),
    [formData, pricingRules]
  );

  // Synchronize effective category whenever central capacity matrix changes
  useEffect(() => {
    if (!pricingSummary.countsConfirmed || !pricingSummary.outboundCapacity) return;

    const cap = pricingSummary.outboundCapacity;
    const needCategoryFix = formData.serviceCategory !== cap.effectiveCategory;

    const retCap = pricingSummary.returnCapacity;
    const needRetCategoryFix =
      Boolean(retCap) &&
      formData.returnUseDifferentCategory &&
      formData.returnServiceCategory !== retCap!.effectiveCategory;

    if (needCategoryFix || needRetCategoryFix) {
      setFormData((prev) => ({
        ...prev,
        serviceCategory: cap.effectiveCategory,
        returnServiceCategory:
          needRetCategoryFix && retCap ? retCap.effectiveCategory : prev.returnServiceCategory,
      }));
    }
  }, [
    formData.serviceCategory,
    formData.returnUseDifferentCategory,
    formData.returnServiceCategory,
    pricingSummary,
  ]);

  const updateField = <K extends keyof WhatsAppBookingFormData>(
    field: K,
    value: WhatsAppBookingFormData[K]
  ) => {
    setFormData((prev) => {
      const next: WhatsAppBookingFormData = { ...prev, [field]: value };

      if (field === 'tripType' && value !== 'استقبال من المطار') {
        next.airline = '';
        next.flightNumber = '';
        next.actualArrivalTime = '';
      }

      if (field === 'hasReturnTrip' && value === true) {
        if (!next.returnPickupLocation.trim() && next.dropoffLocation.trim()) {
          next.returnPickupLocation = next.dropoffLocation.trim();
        }
        if (!next.returnDropoffLocation.trim() && next.pickupLocation.trim()) {
          next.returnDropoffLocation = next.pickupLocation.trim();
        }
      }

      if (field === 'passengersCount' || field === 'luggageCount') {
        const sanitized = sanitizeIntegerInput(String(value));
        next[field] = sanitized as WhatsAppBookingFormData[K];
        const pax = parseStrictInt(next.passengersCount);
        const bags = parseStrictInt(next.luggageCount);

        if (pax !== null && pax >= 1 && bags !== null && bags >= 0) {
          const outAlloc = allocateVehicleForTrip({
            passengersCount: pax,
            luggageCount: bags,
            preferredCategory: prev.serviceCategory,
          });
          next.serviceCategory = outAlloc.effectiveCategory;
        }
      }

      if (field === 'serviceCategory') {
        const pax = parseStrictInt(next.passengersCount);
        const bags = parseStrictInt(next.luggageCount);
        if (pax !== null && pax >= 1 && bags !== null && bags >= 0) {
          const outAlloc = allocateVehicleForTrip({
            passengersCount: pax,
            luggageCount: bags,
            preferredCategory: value as ServiceCategoryKey,
          });
          next.serviceCategory = outAlloc.effectiveCategory;
        }
      }

      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (field === 'luggageCount' || field === 'passengersCount' || field === 'serviceCategory') {
        delete next.serviceCategory;
      }
      if (field === 'tripDate' || field === 'tripTime') {
        delete next.returnDate;
        delete next.returnTime;
      }
      return next;
    });

    if (preparedSubmission) {
      setPreparedSubmission(null);
    }
  };

  if (!isOpen) return null;

  const activeDailyPackage = getDailyRentalPackage(dailyPackageId);
  const coreOutboundReady = isCoreOutboundTripReady(formData);

  const handleStepPassengersDelta = (delta: number) => {
    const current = parseStrictInt(formData.passengersCount);
    if (current === null) {
      if (delta > 0) updateField('passengersCount', '1');
      return;
    }
    const nextVal = Math.max(1, current + delta);
    updateField('passengersCount', String(nextVal));
  };

  const handleStepLuggageDelta = (delta: number) => {
    const current = parseStrictInt(formData.luggageCount);
    if (current === null) {
      updateField('luggageCount', delta > 0 ? '1' : '0');
      return;
    }
    const nextVal = Math.max(0, current + delta);
    updateField('luggageCount', String(nextVal));
  };

  const handleSwapRoute = () => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: prev.dropoffLocation,
      dropoffLocation: prev.pickupLocation,
      tripType: inferTripTypeFromRoute(prev.dropoffLocation, prev.pickupLocation),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pickupLocation;
      delete next.dropoffLocation;
      return next;
    });
    if (preparedSubmission) setPreparedSubmission(null);
  };

  const handleAutoFillReturnFromOutbound = () => {
    setFormData((prev) => ({
      ...prev,
      returnPickupLocation: prev.dropoffLocation,
      returnDropoffLocation: prev.pickupLocation,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.returnPickupLocation;
      delete next.returnDropoffLocation;
      return next;
    });
    if (preparedSubmission) setPreparedSubmission(null);
  };

  const validateStep = (s: WizardStep): BookingValidationErrors => {
    if (s === 1) return validateSectionB(formData);
    if (s === 2) return validateSectionC(formData);
    return validateSectionA(formData);
  };

  const handleGoToStep = (targetStep: WizardStep) => {
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    for (let s = step; s < targetStep; s++) {
      const stepErr = validateStep(s as WizardStep);
      if (Object.keys(stepErr).length > 0) {
        setErrors((prev) => ({ ...prev, ...stepErr }));
        setStep(s as WizardStep);
        return;
      }
    }

    if (targetStep === 3) {
      const err1 = validateSectionB(formData);
      const err2 = validateSectionC(formData);
      const combined = { ...err1, ...err2 };
      if (Object.keys(combined).length > 0) {
        setErrors(combined);
        setStep(Object.keys(err1).length > 0 ? 1 : 2);
        return;
      }
    }

    setStep(targetStep);
  };

  const handleNext = () => {
    if (step < 3) {
      handleGoToStep((step + 1) as WizardStep);
    }
  };

  const handleSubmitTripBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!consentAccepted) {
      setConsentError('يرجى الموافقة على معالجة بيانات الحجز وسياسة الخصوصية للمتابعة.');
      return;
    }
    setConsentError(null);

    const validation = validateWhatsAppBookingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      if (validation.firstInvalidStep) {
        setStep(validation.firstInvalidStep);
      }
      return;
    }

    setIsSubmitting(true);

    // Persist booking record to Firestore for Admin & Customer visibility
    try {
      let customerId = auth.currentUser?.uid;
      if (!customerId) {
        try {
          const credential = await signInAnonymously(auth);
          customerId = credential.user.uid;
        } catch (authErr) {
          console.error('Anonymous auth failed during transfer submit:', authErr);
          setConsentError('تعذر إنشاء الهوية الآمنة للحجز. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
          setIsSubmitting(false);
          return;
        }
      }

      if (!customerId) {
        setConsentError('تعذر توثيق جلسة الحجز. يرجى المحاولة مرة أخرى.');
        setIsSubmitting(false);
        return;
      }

      const customerEmail = auth.currentUser?.email || '';
      const estimatedPrice = pricingSummary.totalPriceEgp ?? (pricingSummary.outboundPriceEgp ?? 0);
      const vehicleCategory = pricingSummary.outboundAllocation?.effectiveCategory || 'sedan_comfort';
      const categoryMeta = SERVICE_CATEGORIES[vehicleCategory];

      const notesCombined = [
        formData.notes?.trim(),
        formData.airline ? `شركة الطيران: ${formData.airline}` : '',
        formData.flightNumber ? `رقم الرحلة: ${formData.flightNumber}` : '',
        formData.actualArrivalTime ? `موعد الوصول الفعلي: ${formData.actualArrivalTime}` : '',
        formData.hasReturnTrip
          ? `رحلة عودة: ${formData.returnDate} ${formData.returnTime} (من ${formData.returnPickupLocation} إلى ${formData.returnDropoffLocation})`
          : '',
        formData.companyName ? `الجهة/الشركة: ${formData.companyName}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const bookingRecord = {
        customerId,
        customerName: formData.fullName.trim(),
        customerPhone: formData.phone.trim(),
        customerEmail,
        serviceId: 'transfer-booking',
        serviceName: `${formData.tripType}: ${formData.pickupLocation} إلى ${formData.dropoffLocation}`,
        vehicleCategoryId: vehicleCategory,
        pickupLocation: formData.pickupLocation.trim(),
        dropoffLocation: formData.dropoffLocation.trim(),
        pickupDateTime: `${formData.tripDate}T${formData.tripTime || '00:00'}`,
        passengersCount: pricingSummary.passengersCount || 1,
        luggageCount: pricingSummary.luggageCount || 0,
        notes: notesCombined,
        status: 'pending_review' as const,
        estimatedPrice,
        paymentStatus: 'unpaid' as const,
        createdAt: new Date().toISOString(),
        serviceCategory: vehicleCategory,
        serviceCategoryLabel: categoryMeta?.fullLabelAr || 'فئة الخدمة',
        pricingType: pricingSummary.totalPriceEgp !== null ? ('fixed' as const) : ('quote_required' as const),
        assignmentStatus: 'unassigned' as const,
      };

      await addDoc(collection(db, 'bookings'), bookingRecord);
      onBookingSubmitted?.();
    } catch (saveErr) {
      console.error('Booking persistence failed; WhatsApp dispatch was blocked:', saveErr);
      setConsentError(
        'تعذر حفظ طلب الحجز حاليًا. لم يتم إرسال الطلب. يرجى المحاولة مرة أخرى بعد التحقق من اتصال الإنترنت.'
      );
      setIsSubmitting(false);
      return;
    }

    const message = buildStructuredWhatsAppBookingMessage(formData, pricingSummary);
    const waUrl = buildWhatsAppClickToChatUrl(message);
    const waWebUrl = buildWhatsAppWebFallbackUrl(message);
    const openedProgrammatically = openWhatsAppSafely(waUrl);

    setPreparedSubmission({
      mode: 'transfer',
      waUrl,
      waWebUrl,
      openedProgrammatically,
    });

    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const handleSubmitDailyRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const today = getLocalDateInputValue();
    const nextErr: Record<string, string> = {};
    if (!dailyUsageDate.trim()) {
      nextErr.dailyUsageDate = 'حدد تاريخ الاستخدام.';
    } else if (dailyUsageDate.trim() < today) {
      nextErr.dailyUsageDate = 'تاريخ الاستخدام لا يمكن أن يكون في الماضي.';
    }
    if (!dailyStartTime.trim()) nextErr.dailyStartTime = 'حدد وقت البدء.';
    if (!dailyName.trim()) nextErr.dailyName = 'أدخل الاسم بالكامل.';
    if (!dailyPhone.trim() || dailyPhone.replace(/\D/g, '').length < 7) {
      nextErr.dailyPhone = 'أدخل رقم هاتف صحيحًا.';
    }

    if (Object.keys(nextErr).length > 0) {
      setDailyErrors(nextErr);
      return;
    }

    setDailyErrors({});
    setIsSubmitting(true);

    // Persist daily rental record to Firestore
    try {
      let customerId = auth.currentUser?.uid;
      if (!customerId) {
        try {
          const credential = await signInAnonymously(auth);
          customerId = credential.user.uid;
        } catch (authErr) {
          console.error('Anonymous auth failed during daily rental submit:', authErr);
          setDailyErrors({ ...dailyErrors, general: 'تعذر إنشاء الهوية الآمنة للحجز. يرجى إعادة المحاولة.' });
          setIsSubmitting(false);
          return;
        }
      }

      if (!customerId) {
        setDailyErrors({ ...dailyErrors, general: 'تعذر توثيق جلسة الحجز. يرجى إعادة المحاولة.' });
        setIsSubmitting(false);
        return;
      }

      const customerEmail = auth.currentUser?.email || '';

      const bookingRecord = {
        customerId,
        customerName: dailyName.trim(),
        customerPhone: dailyPhone.trim(),
        customerEmail,
        serviceId: 'daily-rental',
        serviceName: `تأجير يومي - ${activeDailyPackage.titleAr}`,
        vehicleCategoryId: 'sedan_comfort',
        pickupLocation: 'الإسكندرية',
        dropoffLocation: activeDailyPackage.titleAr,
        pickupDateTime: `${dailyUsageDate}T${dailyStartTime || '09:00'}`,
        passengersCount: 4,
        luggageCount: 0,
        notes: dailyNotes.trim(),
        status: 'pending_review' as const,
        estimatedPrice: activeDailyPackage.priceEgp,
        paymentStatus: 'unpaid' as const,
        createdAt: new Date().toISOString(),
        serviceCategory: 'sedan_comfort' as const,
        serviceCategoryLabel: activeDailyPackage.titleAr,
        pricingType: 'fixed' as const,
        assignmentStatus: 'unassigned' as const,
      };

      await addDoc(collection(db, 'bookings'), bookingRecord);
      onBookingSubmitted?.();
    } catch (saveErr) {
      console.error('Daily rental persistence failed; WhatsApp dispatch was blocked:', saveErr);
      setDailyErrors((prev) => ({
        ...prev,
        general:
          'تعذر حفظ طلب التأجير اليومي حاليًا. لم يتم إرسال الطلب. يرجى المحاولة مرة أخرى بعد التحقق من اتصال الإنترنت.',
      }));
      setIsSubmitting(false);
      return;
    }

    const message = buildDailyRentalWhatsAppMessage({
      customerName: dailyName.trim(),
      customerPhone: dailyPhone.trim(),
      pkg: activeDailyPackage,
      usageDate: dailyUsageDate,
      startTime: dailyStartTime,
      notes: dailyNotes,
    });
    const waUrl = buildDailyRentalWhatsAppUrl({
      customerName: dailyName.trim(),
      customerPhone: dailyPhone.trim(),
      pkg: activeDailyPackage,
      usageDate: dailyUsageDate,
      startTime: dailyStartTime,
      notes: dailyNotes,
    });
    const waWebUrl = buildWhatsAppWebFallbackUrl(message);
    const openedProgrammatically = openWhatsAppSafely(waUrl);

    setPreparedSubmission({
      mode: 'daily_rental',
      waUrl,
      waWebUrl,
      openedProgrammatically,
    });

    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const stepMeta: Array<{ num: WizardStep; shortLabel: string }> = [
    { num: 1, shortLabel: '1. تفاصيل الرحلة' },
    { num: 2, shortLabel: '2. الركاب والسيارة' },
    { num: 3, shortLabel: '3. البيانات والمراجعة' },
  ];

  const effectiveCategory =
    pricingSummary.countsConfirmed && pricingSummary.outboundCapacity
      ? pricingSummary.outboundCapacity.effectiveCategory
      : null;
  const effectiveCategoryMeta = effectiveCategory ? SERVICE_CATEGORIES[effectiveCategory] : null;
  const allowedCategories =
    pricingSummary.countsConfirmed && pricingSummary.outboundCapacity
      ? pricingSummary.outboundCapacity.allowedCategories
      : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#0B1522]/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      dir="rtl"
    >
      <div className="relative w-full max-w-3xl bg-[#152438] border-t sm:border border-[#C9A96B]/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden sm:my-3 text-right text-[#F6F5F1]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 bg-[#101D2D] border-b border-[#C9A96B]/20 gap-3">
          <div className="min-w-0">
            <h2 id="booking-modal-title" className="font-card-heading text-white truncate">
              {bookingMode === 'daily_rental'
                ? 'حجز التأجير اليومي داخل الإسكندرية'
                : 'حجز رحلة — Al Wakeel Limousine'}
            </h2>
            <p className="font-label text-[#91B9C8] mt-0.5">
              خدمة الحجوزات{' '}
              <span dir="ltr" className="font-latin text-[#C9A96B] tabular-nums">
                {WHATSAPP_COMPANY_PHONE_DISPLAY}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة الحجز"
            className="text-[#9A9A96] hover:text-white bg-[#152438] w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 border border-[#C9A96B]/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-7 space-y-5 max-h-[86vh] overflow-y-auto">

          {/* Mode Switcher: Trip Booking vs Daily Rental */}
          <div
            className="grid grid-cols-2 gap-2 p-1 bg-[#101D2D] border border-[#C9A96B]/25 rounded-xl"
            role="tablist"
            aria-label="نوع الطلب"
          >
            <button
              type="button"
              role="tab"
              aria-selected={bookingMode === 'transfer'}
              onClick={() => {
                setBookingMode('transfer');
                setPreparedSubmission(null);
              }}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap truncate ${
                bookingMode === 'transfer'
                  ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                  : 'text-[#9A9A96] hover:text-white'
              }`}
            >
              حجز رحلة / مطار
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={bookingMode === 'daily_rental'}
              onClick={() => {
                setBookingMode('daily_rental');
                setPreparedSubmission(null);
              }}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap truncate ${
                bookingMode === 'daily_rental'
                  ? 'bg-[#C9A96B] text-[#101D2D] font-bold'
                  : 'text-[#9A9A96] hover:text-white'
              }`}
            >
              التأجير اليومي بالإسكندرية
            </button>
          </div>

          {/* Prepared / Open-Failure Submission Banner (zero WhatsApp branding, never clears data) */}
          {preparedSubmission && (
            <div
              role="status"
              aria-live="polite"
              className={`bg-[#101D2D] border rounded-2xl p-4 sm:p-5 space-y-4 ${
                preparedSubmission.openedProgrammatically
                  ? 'border-[#C9A96B]/60'
                  : 'border-amber-400/70'
              }`}
            >
              <div className="flex items-start gap-3">
                {preparedSubmission.openedProgrammatically ? (
                  <CheckCircle2 className="w-5 h-5 text-[#C9A96B] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h3 className="font-subheading text-[#DFC89B]">
                    {preparedSubmission.openedProgrammatically
                      ? 'الخطوة الأخيرة: استكمال إرسال الطلب'
                      : 'تعذر فتح رابط الإرسال'}
                  </h3>
                  <p className="font-body text-[#F6F5F1] leading-relaxed">
                    {preparedSubmission.openedProgrammatically
                      ? BOOKING_PREPARED_INSTRUCTION_AR
                      : BOOKING_OPEN_FAILED_INSTRUCTION_AR}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                <a
                  href={preparedSubmission.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>
                    {preparedSubmission.openedProgrammatically
                      ? 'فتح رابط الإرسال'
                      : 'إعادة المحاولة'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <a
                  href={preparedSubmission.waWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#152438] hover:bg-[#1c2f48] border border-[#C9A96B]/35 text-[#F6F5F1] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>رابط الإرسال البديل</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#C9A96B]" />
                </a>

                <button
                  type="button"
                  onClick={() => setPreparedSubmission(null)}
                  className="min-h-[46px] px-4 py-2 rounded-xl border border-[#C9A96B]/20 text-xs sm:text-sm text-[#91B9C8] hover:text-white transition-colors whitespace-nowrap"
                >
                  تعديل البيانات
                </button>
              </div>
            </div>
          )}

          {bookingMode === 'daily_rental' ? (
            /* ========================================================= */
            /* DAILY RENTAL — ALEXANDRIA FLOW (PRESERVED)                */
            /* ========================================================= */
            <form onSubmit={handleSubmitDailyRental} noValidate className="space-y-5">
              <div>
                <h3 className="font-subheading text-white">اختر باقة التأجير اليومي داخل الإسكندرية *</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DAILY_RENTAL_PACKAGES.map((pkg) => {
                  const isSelected = dailyPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setDailyPackageId(pkg.id)}
                      className={`text-right rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#101D2D] border-[#C9A96B] ring-1 ring-[#C9A96B]/60'
                          : 'bg-[#101D2D]/70 border-[#C9A96B]/20 hover:border-[#C9A96B]/55'
                      }`}
                    >
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <span dir="ltr" className="font-latin text-xs font-semibold text-[#C9A96B]">
                            {pkg.titleEn}
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              isSelected
                                ? 'bg-[#C9A96B] border-[#C9A96B] text-[#101D2D]'
                                : 'border-[#C9A96B]/35 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <h4 className="font-card-heading text-white">{pkg.titleAr}</h4>
                        <p className="font-sub text-[#9A9A96]">
                          {pkg.durationLabelAr} · {pkg.distanceLabelAr} · {pkg.scopeLabelAr}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#C9A96B]/15 w-full flex items-center justify-between">
                        <span className="font-label text-[#91B9C8]">السعر:</span>
                        <span className="text-base sm:text-lg font-bold text-[#C9A96B] tabular-nums">
                          {pkg.priceEgp.toLocaleString('en-US')} جنيه مصري
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="daily-date" className="block font-label text-[#91B9C8] mb-1.5">
                    تاريخ الاستخدام *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                    <input
                      id="daily-date"
                      type="date"
                      min={getLocalDateInputValue()}
                      value={dailyUsageDate}
                      onChange={(e) => {
                        setDailyUsageDate(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyUsageDate: '' }));
                      }}
                      className="w-full min-h-[48px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                    />
                  </div>
                  {dailyErrors.dailyUsageDate && (
                    <p role="alert" className="mt-1 text-xs text-red-300">
                      {dailyErrors.dailyUsageDate}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="daily-time" className="block font-label text-[#91B9C8] mb-1.5">
                    وقت البدء *
                  </label>
                  <div className="relative">
                    <Clock className="absolute right-3.5 top-3.5 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                    <input
                      id="daily-time"
                      type="time"
                      value={dailyStartTime}
                      onChange={(e) => {
                        setDailyStartTime(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyStartTime: '' }));
                      }}
                      className="w-full min-h-[48px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                    />
                  </div>
                  {dailyErrors.dailyStartTime && (
                    <p role="alert" className="mt-1 text-xs text-red-300">
                      {dailyErrors.dailyStartTime}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="daily-name" className="block font-label text-[#91B9C8] mb-1.5">
                    الاسم بالكامل *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-[#9A9A96] pointer-events-none" />
                    <input
                      id="daily-name"
                      type="text"
                      placeholder="الاسم الكامل"
                      value={dailyName}
                      onChange={(e) => {
                        setDailyName(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyName: '' }));
                      }}
                      className="w-full min-h-[48px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                    />
                  </div>
                  {dailyErrors.dailyName && (
                    <p role="alert" className="mt-1 text-xs text-red-300">
                      {dailyErrors.dailyName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="daily-phone" className="block font-label text-[#91B9C8] mb-1.5">
                    رقم الهاتف *
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-[#9A9A96] pointer-events-none" />
                    <input
                      id="daily-phone"
                      type="tel"
                      dir="ltr"
                      placeholder="+20 10..."
                      value={dailyPhone}
                      onChange={(e) => {
                        setDailyPhone(e.target.value);
                        setDailyErrors((p) => ({ ...p, dailyPhone: '' }));
                      }}
                      className="w-full min-h-[48px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none text-left"
                    />
                  </div>
                  {dailyErrors.dailyPhone && (
                    <p role="alert" className="mt-1 text-xs text-red-300">
                      {dailyErrors.dailyPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="daily-notes" className="block font-label text-[#91B9C8] mb-1.5">
                  عنوان الاستلام داخل الإسكندرية (اختياري)
                </label>
                <input
                  id="daily-notes"
                  type="text"
                  placeholder="مثال: سموحة / سان ستيفانو..."
                  value={dailyNotes}
                  onChange={(e) => setDailyNotes(e.target.value)}
                  className="w-full min-h-[48px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#C9A96B]/20">
                <a
                  href={OFFICIAL_TEL_HREF}
                  className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9A96B]" />
                  <span>اتصال مباشر:</span>
                  <span dir="ltr" className="font-latin tabular-nums">{OFFICIAL_WHATSAPP_NUMBER}</span>
                </a>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[50px] px-7 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base shadow-lg inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>إرسال الحجز</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================= */
            /* 3-STAGE CONVERSION-OPTIMIZED TRIP BOOKING FLOW            */
            /* ========================================================= */
            <form onSubmit={handleSubmitTripBooking} noValidate className="space-y-6">

              {/* Simple 3-Stage Progress Indicator */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="مراحل الحجز">
                  {stepMeta.map((item) => {
                    const isCurrent = step === item.num;
                    const isCompleted = step > item.num;
                    return (
                      <button
                        key={item.num}
                        type="button"
                        onClick={() => handleGoToStep(item.num)}
                        className={`min-h-[44px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-colors text-center truncate whitespace-nowrap ${
                          isCurrent
                            ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                            : isCompleted
                              ? 'bg-[#101D2D] text-[#C9A96B] border-[#C9A96B]/50 hover:border-[#C9A96B]'
                              : 'bg-[#101D2D]/60 text-[#9A9A96] border-[#C9A96B]/20 hover:text-white'
                        }`}
                      >
                        {item.shortLabel}
                      </button>
                    );
                  })}
                </div>
                <div className="w-full h-1.5 bg-[#101D2D] rounded-full overflow-hidden" aria-hidden="true">
                  <div
                    className="h-full bg-[#C9A96B] transition-all duration-200 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* ===================================================== */}
              {/* STAGE 1 — TRIP DETAILS (+ SMART RETURN QUESTION)      */}
              {/* ===================================================== */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-subheading text-white">تفاصيل الرحلة</h3>
                    <button
                      type="button"
                      onClick={handleSwapRoute}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-[#101D2D] border border-[#C9A96B]/30 text-xs font-medium text-[#C9A96B] hover:border-[#C9A96B] whitespace-nowrap"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>عكس الاتجاه</span>
                    </button>
                  </div>

                  {/* 4 Service Types */}
                  <div>
                    <label className="block font-label text-[#91B9C8] mb-2">
                      نوع الخدمة *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TRIP_TYPE_OPTIONS.map((typeOption) => {
                        const active = formData.tripType === typeOption;
                        return (
                          <button
                            key={typeOption}
                            type="button"
                            onClick={() => updateField('tripType', typeOption as TripTypeOption)}
                            className={`min-h-[46px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors text-center whitespace-nowrap truncate ${
                              active
                                ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                                : 'bg-[#101D2D] text-[#F6F5F1] border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                            }`}
                          >
                            {typeOption}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Origin & Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bk-pickup" className="block font-label text-[#91B9C8] mb-1.5">
                        نقطة التحرك *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="bk-pickup"
                          type="text"
                          required
                          placeholder="أدخل نقطة التحرك"
                          value={formData.pickupLocation}
                          onChange={(e) => updateField('pickupLocation', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.pickupLocation
                              ? 'border-red-400'
                              : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {QUICK_LOCATIONS.slice(0, 4).map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => updateField('pickupLocation', loc)}
                            className="text-xs px-2.5 py-1.5 min-h-[34px] rounded-lg bg-[#101D2D] border border-[#C9A96B]/20 text-[#91B9C8] hover:text-white hover:border-[#C9A96B]/50 transition-colors whitespace-nowrap"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                      {errors.pickupLocation && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300">
                          {errors.pickupLocation}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="bk-dropoff" className="block font-label text-[#91B9C8] mb-1.5">
                        الوجهة *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="bk-dropoff"
                          type="text"
                          required
                          placeholder="أدخل الوجهة"
                          value={formData.dropoffLocation}
                          onChange={(e) => updateField('dropoffLocation', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.dropoffLocation
                              ? 'border-red-400'
                              : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {QUICK_LOCATIONS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => updateField('dropoffLocation', loc)}
                            className="text-xs px-2.5 py-1.5 min-h-[34px] rounded-lg bg-[#101D2D] border border-[#C9A96B]/20 text-[#91B9C8] hover:text-white hover:border-[#C9A96B]/50 transition-colors whitespace-nowrap"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                      {errors.dropoffLocation && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300">
                          {errors.dropoffLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bk-date" className="block font-label text-[#91B9C8] mb-1.5">
                        تاريخ الرحلة *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute right-3.5 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="bk-date"
                          type="date"
                          required
                          min={getLocalDateInputValue()}
                          value={formData.tripDate}
                          onChange={(e) => updateField('tripDate', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none ${
                            errors.tripDate
                              ? 'border-red-400'
                              : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.tripDate && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300">
                          {errors.tripDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="bk-time" className="block font-label text-[#91B9C8] mb-1.5">
                        وقت الرحلة *
                      </label>
                      <div className="relative">
                        <Clock className="absolute right-3.5 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="bk-time"
                          type="time"
                          required
                          value={formData.tripTime}
                          onChange={(e) => updateField('tripTime', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none ${
                            errors.tripTime
                              ? 'border-red-400'
                              : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.tripTime && (
                        <p role="alert" className="mt-1.5 text-xs text-red-300">
                          {errors.tripTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Flight Fields: Shown ONLY when service is Airport Pickup */}
                  {formData.tripType === 'استقبال من المطار' && (
                    <div className="bg-[#101D2D]/80 border border-[#C9A96B]/25 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 font-label text-[#91B9C8]">
                        <Plane className="w-4 h-4 text-[#C9A96B] shrink-0" />
                        <span>بيانات الرحلة الجوية (اختياري)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label htmlFor="bk-airline" className="block text-xs text-[#9A9A96] mb-1">
                            شركة الطيران
                          </label>
                          <input
                            id="bk-airline"
                            type="text"
                            placeholder="مثال: مصر للطيران"
                            value={formData.airline}
                            onChange={(e) => updateField('airline', e.target.value)}
                            className="w-full min-h-[46px] bg-[#152438] border border-[#C9A96B]/25 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="bk-flight" className="block text-xs text-[#9A9A96] mb-1">
                            رقم الرحلة الجوية
                          </label>
                          <input
                            id="bk-flight"
                            type="text"
                            dir="ltr"
                            placeholder="MS 612"
                            value={formData.flightNumber}
                            onChange={(e) => updateField('flightNumber', e.target.value)}
                            className="w-full min-h-[46px] bg-[#152438] border border-[#C9A96B]/25 rounded-xl px-3.5 py-2 text-sm text-white text-left placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="bk-actual-arrival" className="block text-xs text-[#9A9A96] mb-1">
                            موعد الوصول الفعلي
                          </label>
                          <input
                            id="bk-actual-arrival"
                            type="time"
                            value={formData.actualArrivalTime}
                            onChange={(e) => updateField('actualArrivalTime', e.target.value)}
                            className="w-full min-h-[46px] bg-[#152438] border border-[#C9A96B]/25 rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#C9A96B] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Return Trip Question: Revealed ONLY after core outbound details are complete */}
                  {coreOutboundReady && (
                    <div className="bg-[#101D2D]/85 border border-[#C9A96B]/25 rounded-2xl p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="font-subheading text-white">هل توجد رحلة عودة؟</p>
                        <div className="grid grid-cols-2 gap-2 shrink-0 min-w-[170px]">
                          <button
                            type="button"
                            onClick={() => {
                              updateField('hasReturnTrip', false);
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.returnDate;
                                delete next.returnTime;
                                delete next.returnPickupLocation;
                                delete next.returnDropoffLocation;
                                return next;
                              });
                            }}
                            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${
                              !formData.hasReturnTrip
                                ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                                : 'bg-[#152438] text-[#F6F5F1] border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                            }`}
                          >
                            لا
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField('hasReturnTrip', true)}
                            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${
                              formData.hasReturnTrip
                                ? 'bg-[#C9A96B] text-[#101D2D] border-[#C9A96B] font-bold'
                                : 'bg-[#152438] text-[#F6F5F1] border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                            }`}
                          >
                            نعم
                          </button>
                        </div>
                      </div>

                      {formData.hasReturnTrip && (
                        <div className="pt-3 border-t border-[#C9A96B]/20 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-label text-[#DFC89B]">بيانات رحلة العودة *</span>
                            <button
                              type="button"
                              onClick={handleAutoFillReturnFromOutbound}
                              className="text-xs text-[#C9A96B] hover:text-[#DFC89B] inline-flex items-center gap-1 whitespace-nowrap"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span>عكس مسار الذهاب</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label htmlFor="bk-return-date" className="block font-label text-[#91B9C8] mb-1">
                                تاريخ العودة *
                              </label>
                              <input
                                id="bk-return-date"
                                type="date"
                                min={formData.tripDate || getLocalDateInputValue()}
                                value={formData.returnDate}
                                onChange={(e) => updateField('returnDate', e.target.value)}
                                className={`w-full min-h-[48px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none ${
                                  errors.returnDate ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                                }`}
                              />
                              {errors.returnDate && (
                                <p role="alert" className="mt-1 text-xs text-red-300">
                                  {errors.returnDate}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="bk-return-time" className="block font-label text-[#91B9C8] mb-1">
                                وقت العودة *
                              </label>
                              <input
                                id="bk-return-time"
                                type="time"
                                value={formData.returnTime}
                                onChange={(e) => updateField('returnTime', e.target.value)}
                                className={`w-full min-h-[48px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none ${
                                  errors.returnTime ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                                }`}
                              />
                              {errors.returnTime && (
                                <p role="alert" className="mt-1 text-xs text-red-300">
                                  {errors.returnTime}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="bk-return-pickup" className="block font-label text-[#91B9C8] mb-1">
                                نقطة التحرك (العودة) *
                              </label>
                              <input
                                id="bk-return-pickup"
                                type="text"
                                placeholder="نقطة التحرك للعودة"
                                value={formData.returnPickupLocation}
                                onChange={(e) => updateField('returnPickupLocation', e.target.value)}
                                className={`w-full min-h-[48px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                                  errors.returnPickupLocation ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                                }`}
                              />
                              {errors.returnPickupLocation && (
                                <p role="alert" className="mt-1 text-xs text-red-300">
                                  {errors.returnPickupLocation}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="bk-return-dropoff" className="block font-label text-[#91B9C8] mb-1">
                                الوجهة (العودة) *
                              </label>
                              <input
                                id="bk-return-dropoff"
                                type="text"
                                placeholder="الوجهة للعودة"
                                value={formData.returnDropoffLocation}
                                onChange={(e) => updateField('returnDropoffLocation', e.target.value)}
                                className={`w-full min-h-[48px] bg-[#152438] border rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                                  errors.returnDropoffLocation ? 'border-red-400' : 'border-[#C9A96B]/25 focus:border-[#C9A96B]'
                                }`}
                              />
                              {errors.returnDropoffLocation && (
                                <p role="alert" className="mt-1 text-xs text-red-300">
                                  {errors.returnDropoffLocation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-3 border-t border-[#C9A96B]/15">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto min-h-[50px] px-7 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                    >
                      <span>التالي: الركاب والسيارة</span>
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* STAGE 2 — PASSENGERS, LUGGAGE & AUTO VEHICLE/PRICE    */}
              {/* ===================================================== */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-subheading text-white">
                      {formData.passengersFromQuickBar
                        ? 'الحقائب والسيارة المناسبة'
                        : 'عدد الركاب والحقائب والسيارة'}
                    </h3>
                    <p className="font-sub text-[#9A9A96]">
                      {formData.passengersFromQuickBar
                        ? 'تم حفظ عدد الركاب؛ حدد عدد الحقائب ليتم اختيار السيارة المناسبة وحساب السعر تلقائيًا.'
                        : 'حدد عدد الركاب وعدد الحقائب ليتم اختيار السيارة المناسبة وحساب السعر تلقائيًا.'}
                    </p>
                  </div>

                  {/* Single-Entry Rule: Read-only summary if entered on Homepage QuickBookingBar, otherwise show interactive counter once */}
                  <div className={`grid grid-cols-1 ${formData.passengersFromQuickBar ? '' : 'sm:grid-cols-2'} gap-4`}>
                    {formData.passengersFromQuickBar ? (
                      <div className="bg-[#101D2D] border border-[#C9A96B]/25 rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-[#C9A96B] shrink-0" />
                          <div>
                            <span className="font-label text-[#91B9C8] block">عدد الركاب</span>
                            <span className="text-base font-bold text-white tabular-nums">
                              {`${Number(formData.passengersCount)} ${
                                Number(formData.passengersCount) === 1 ? 'راكب' : 'ركاب'
                              }`}
                            </span>
                          </div>
                        </div>
                        {onEditPassengersAtEntry && (
                          <button
                            type="button"
                            onClick={() => onEditPassengersAtEntry(2)}
                            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#152438] border border-[#C9A96B]/30 text-xs font-medium text-[#C9A96B] hover:border-[#C9A96B] inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Passengers Counter — First & Only input location when opened directly */
                      <div className="bg-[#101D2D] border border-[#C9A96B]/25 rounded-2xl p-4 space-y-2.5">
                        <label htmlFor="bk-passengers" className="block font-label text-[#91B9C8]">
                          عدد الركاب *
                        </label>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleStepPassengersDelta(-1)}
                            disabled={!formData.passengersCount || Number(formData.passengersCount) <= 1}
                            aria-label="إنقاص عدد الركاب"
                            className="w-12 h-12 rounded-xl bg-[#152438] border border-[#C9A96B]/30 text-[#C9A96B] hover:bg-[#C9A96B] hover:text-[#101D2D] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors shrink-0"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="relative flex-1">
                            <Users className="absolute right-3 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                            <input
                              id="bk-passengers"
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="—"
                              aria-required="true"
                              value={formData.passengersCount}
                              onChange={(e) => updateField('passengersCount', e.target.value)}
                              className={`w-full min-h-[48px] bg-[#152438] border rounded-xl pr-9 pl-3 py-2 text-center text-base font-bold text-white placeholder:text-[#9A9A96]/60 focus:outline-none tabular-nums ${
                                errors.passengersCount
                                  ? 'border-red-400'
                                  : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                              }`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleStepPassengersDelta(1)}
                            aria-label="زيادة عدد الركاب"
                            className="w-12 h-12 rounded-xl bg-[#152438] border border-[#C9A96B]/30 text-[#C9A96B] hover:bg-[#C9A96B] hover:text-[#101D2D] flex items-center justify-center transition-colors shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {errors.passengersCount && (
                          <p role="alert" className="text-xs text-red-300">
                            {errors.passengersCount}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Luggage Counter (allows 0, rejects negative & decimals) */}
                    <div className="bg-[#101D2D] border border-[#C9A96B]/25 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <label htmlFor="bk-luggage" className="block font-label text-[#91B9C8]">
                          عدد الحقائب *
                        </label>
                        {formData.luggageCount === '' && (
                          <button
                            type="button"
                            onClick={() => updateField('luggageCount', '0')}
                            className="text-xs text-[#C9A96B] hover:text-[#DFC89B] whitespace-nowrap"
                          >
                            بدون حقائب (0)
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleStepLuggageDelta(-1)}
                          disabled={formData.luggageCount === '0'}
                          aria-label="إنقاص عدد الحقائب"
                          className="w-12 h-12 rounded-xl bg-[#152438] border border-[#C9A96B]/30 text-[#C9A96B] hover:bg-[#C9A96B] hover:text-[#101D2D] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors shrink-0"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="relative flex-1">
                          <Briefcase className="absolute right-3 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                          <input
                            id="bk-luggage"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="—"
                            aria-required="true"
                            value={formData.luggageCount}
                            onChange={(e) => updateField('luggageCount', e.target.value)}
                            className={`w-full min-h-[48px] bg-[#152438] border rounded-xl pr-9 pl-3 py-2 text-center text-base font-bold text-white placeholder:text-[#9A9A96]/60 focus:outline-none tabular-nums ${
                              errors.luggageCount
                                ? 'border-red-400'
                                : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStepLuggageDelta(1)}
                          aria-label="زيادة عدد الحقائب"
                          className="w-12 h-12 rounded-xl bg-[#152438] border border-[#C9A96B]/30 text-[#C9A96B] hover:bg-[#C9A96B] hover:text-[#101D2D] flex items-center justify-center transition-colors shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {errors.luggageCount && (
                        <p role="alert" className="text-xs text-red-300">
                          {errors.luggageCount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Awaiting User Selection Prompt OR Smart Vehicle & Pricing Results */}
                  {!pricingSummary.countsConfirmed ? (
                    <div className="bg-[#101D2D]/80 border border-[#C9A96B]/25 rounded-2xl p-4 flex items-center gap-3 text-sm text-[#91B9C8]">
                      <Info className="w-4 h-4 text-[#C9A96B] shrink-0" />
                      <span>
                        {formData.passengersFromQuickBar
                          ? 'حدد عدد الحقائب أولًا لعرض السيارات المناسبة والسعر المعتمد.'
                          : 'حدد عدد الركاب وعدد الحقائب أولًا لعرض السيارات المناسبة والسعر المعتمد.'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pricingSummary.outboundCapacity?.noticeAr && (
                        <div
                          role="status"
                          className="bg-[#C9A96B]/12 border border-[#C9A96B]/55 rounded-2xl p-3.5 flex items-start gap-2.5 text-sm text-[#DFC89B]"
                        >
                          <Info className="w-4 h-4 text-[#C9A96B] shrink-0 mt-0.5" />
                          <p className="leading-relaxed">{pricingSummary.outboundCapacity.noticeAr}</p>
                        </div>
                      )}

                      {/* Render Eligible Service Categories Only (no Mini Van initially; never show model selectors) */}
                      {allowedCategories.length > 0 && (
                        <div className="space-y-2.5">
                          <label className="font-label text-[#91B9C8] flex items-center gap-1.5">
                            <Car className="w-4 h-4 text-[#C9A96B]" />
                            <span>الفئة المخصصة المتاحة</span>
                          </label>

                          <div
                            className={`grid gap-3 ${
                              allowedCategories.length === 1
                                ? 'grid-cols-1'
                                : allowedCategories.length === 3
                                  ? 'grid-cols-1 sm:grid-cols-3'
                                  : 'grid-cols-1 sm:grid-cols-2'
                            }`}
                          >
                            {allowedCategories.map((catKey) => {
                              const meta = SERVICE_CATEGORIES[catKey];
                              const isSelected = effectiveCategory === catKey;
                              const catQuote = computeBookingPricingSummary(
                                { ...formData, serviceCategory: catKey },
                                pricingRules
                              ).outboundPriceEgp;
                              const capSpec = pricingSummary.outboundCapacity?.categorySpecs[catKey];

                              return (
                                <button
                                  key={catKey}
                                  type="button"
                                  onClick={() => updateField('serviceCategory', catKey)}
                                  className={`text-right rounded-2xl p-4 border transition-all flex flex-col justify-between gap-2.5 ${
                                    isSelected
                                      ? 'bg-[#101D2D] border-[#C9A96B] ring-1 ring-[#C9A96B]/60'
                                      : 'bg-[#101D2D]/75 border-[#C9A96B]/25 hover:border-[#C9A96B]/60'
                                  }`}
                                >
                                  <div className="space-y-1.5 w-full">
                                    <div className="flex items-center justify-between gap-2 w-full">
                                      <div>
                                        <p className="text-sm font-bold text-white">{meta.titleAr}</p>
                                        <span dir="ltr" className="font-latin text-xs text-[#C9A96B]">
                                          {meta.titleEn}
                                        </span>
                                      </div>
                                      <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                                          isSelected
                                            ? 'bg-[#C9A96B] border-[#C9A96B] text-[#101D2D]'
                                            : 'border-[#C9A96B]/35 text-transparent'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </span>
                                    </div>
                                    {capSpec && (
                                      <p className="text-[11px] text-[#91B9C8] tabular-nums">
                                        حتى {capSpec.maxPassengers} ركاب · حتى {capSpec.maxLuggage} حقائب
                                      </p>
                                    )}
                                  </div>

                                  <div className="pt-2 border-t border-[#C9A96B]/15 w-full flex items-center justify-between text-xs">
                                    <span className="text-[#9A9A96]">سعر الذهاب:</span>
                                    <span className="font-bold text-[#C9A96B] tabular-nums">
                                      {catQuote !== null
                                        ? `${catQuote.toLocaleString('en-US')} ج.م`
                                        : 'بعد المراجعة'}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Single Representative Vehicle Visual (Auto-Allocated — Zero Customer Model Choice) */}
                      {pricingSummary.outboundAllocation && (
                        <div className="bg-[#101D2D] border border-[#C9A96B]/30 rounded-2xl overflow-hidden">
                          <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                            <div className="sm:col-span-5 relative aspect-video w-full overflow-hidden bg-[#0B1522]">
                              <img
                                key={pricingSummary.outboundAllocation.representativeVehicleId}
                                src={
                                  REPRESENTATIVE_IMAGES_BY_MODEL_ID[
                                    pricingSummary.outboundAllocation.representativeVehicleId
                                  ]
                                }
                                alt={`${effectiveCategoryMeta?.titleEn || pricingSummary.outboundAllocation.representativeModelNameEn} (${pricingSummary.outboundAllocation.representativeColorAr})`}
                                width={1000}
                                height={558}
                                loading="eager"
                                decoding="async"
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                            <div className="sm:col-span-7 p-4 space-y-2 text-right">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-label text-[#C9A96B] font-semibold">
                                  الصورة التمثيلية للفئة المخصصة
                                </span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#152438] border border-[#C9A96B]/30 text-[#DFC89B]">
                                  اللون المعتمد: {pricingSummary.outboundAllocation.representativeColorAr}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-white">
                                {effectiveCategoryMeta?.fullLabelAr}
                              </p>
                              <p className="text-xs text-[#9A9A96] leading-relaxed">
                                {VEHICLE_ALLOCATION_DISCLAIMER_AR}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Live Prominent Price Box */}
                      <div className="bg-[#101D2D] border border-[#C9A96B]/45 rounded-2xl p-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[#91B9C8]">سعر الذهاب:</span>
                          <span className="font-bold text-white tabular-nums">
                            {pricingSummary.outboundPriceEgp !== null
                              ? `${pricingSummary.outboundPriceEgp.toLocaleString('en-US')} جنيه مصري`
                              : QUOTE_REVIEW_MESSAGE_AR}
                          </span>
                        </div>
                        {formData.hasReturnTrip && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[#91B9C8]">سعر العودة:</span>
                            <span className="font-bold text-white tabular-nums">
                              {pricingSummary.returnPriceEgp !== null
                                ? `${pricingSummary.returnPriceEgp.toLocaleString('en-US')} جنيه مصري`
                                : QUOTE_REVIEW_MESSAGE_AR}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C9A96B]/20">
                          <span className="font-semibold text-[#DFC89B]">الإجمالي:</span>
                          <span className="text-base sm:text-lg font-bold text-[#C9A96B] tabular-nums">
                            {pricingSummary.totalPriceEgp !== null
                              ? `${pricingSummary.totalPriceEgp.toLocaleString('en-US')} جنيه مصري`
                              : QUOTE_REVIEW_MESSAGE_AR}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#C9A96B]/15">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#101D2D] border border-[#C9A96B]/25 text-sm text-[#9A9A96] hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="min-h-[50px] px-7 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base inline-flex items-center gap-2 transition-all whitespace-nowrap"
                    >
                      <span>التالي: البيانات والمراجعة</span>
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* STAGE 3 — CUSTOMER DETAILS, SUMMARY & SEND            */}
              {/* ===================================================== */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-subheading text-white">بيانات العميل ومراجعة الطلب</h3>
                    <p className="font-sub text-[#9A9A96]">
                      أدخل بيانات التواصل ثم راجع تفاصيل رحلتك والسعر وأرسل الحجز مباشرة.
                    </p>
                  </div>

                  {/* Customer Info Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bk-fullname" className="block font-label text-[#91B9C8] mb-1.5">
                        الاسم بالكامل *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute right-3.5 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="bk-fullname"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="الاسم الثلاثي"
                          value={formData.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.fullName
                              ? 'border-red-400'
                              : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p role="alert" className="mt-1 text-xs text-red-300">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="bk-phone" className="block font-label text-[#91B9C8] mb-1.5">
                        رقم الهاتف *
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3.5 top-4 w-4 h-4 text-[#C9A96B] pointer-events-none" />
                        <input
                          id="bk-phone"
                          type="tel"
                          dir="ltr"
                          required
                          autoComplete="tel"
                          placeholder="+20 100 000 0000"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className={`w-full min-h-[48px] bg-[#101D2D] border rounded-xl pr-10 pl-4 py-2.5 text-sm text-white text-left placeholder:text-[#9A9A96]/60 focus:outline-none ${
                            errors.phone
                              ? 'border-red-400'
                              : 'border-[#C9A96B]/30 focus:border-[#C9A96B]'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p role="alert" className="mt-1 text-xs text-red-300">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="bk-company" className="block font-label text-[#91B9C8] mb-1.5">
                        اسم الشركة (اختياري)
                      </label>
                      <div className="relative">
                        <Building2 className="absolute right-3.5 top-4 w-4 h-4 text-[#9A9A96] pointer-events-none" />
                        <input
                          id="bk-company"
                          type="text"
                          autoComplete="organization"
                          placeholder="في حال كان الحجز لشركة أو جهة عمل"
                          value={formData.companyName}
                          onChange={(e) => updateField('companyName', e.target.value)}
                          className="w-full min-h-[48px] bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="bk-notes" className="block font-label text-[#91B9C8] mb-1.5">
                        ملاحظات إضافية (اختياري)
                      </label>
                      <textarea
                        id="bk-notes"
                        rows={2}
                        placeholder="أي تفاصيل خاصة مثل مقعد أطفال، نقطة انتظار محددة، إلخ..."
                        value={formData.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        className="w-full bg-[#101D2D] border border-[#C9A96B]/30 rounded-xl p-3 text-sm text-white placeholder:text-[#9A9A96]/60 focus:border-[#C9A96B] focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Condensed Review Summary + Prominent Vehicle & Price Card */}
                  <div className="bg-[#101D2D] border border-[#C9A96B]/45 rounded-2xl p-4 sm:p-5 space-y-4">
                    {/* Route & Schedule Summary */}
                    <div className="space-y-2 pb-3 border-b border-[#C9A96B]/15 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-label text-[#C9A96B] font-semibold">ملخص الرحلة</span>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل الرحلة</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[#DFC89B] font-medium">{formData.tripType}</span>
                        <span className="text-white tabular-nums">
                          {formatReadableDate(formData.tripDate)} · {formatReadableTime(formData.tripTime)}
                        </span>
                      </div>

                      <p className="text-white">
                        {formData.pickupLocation} <span className="text-[#C9A96B] mx-1">←</span>{' '}
                        {formData.dropoffLocation}
                      </p>

                      {formData.tripType === 'استقبال من المطار' &&
                        (formData.airline.trim() ||
                          formData.flightNumber.trim() ||
                          formData.actualArrivalTime.trim()) && (
                          <p className="text-xs text-[#91B9C8]">
                            {[
                              formData.airline.trim() ? `الطيران: ${formData.airline.trim()}` : '',
                              formData.flightNumber.trim()
                                ? `الرحلة: ${formData.flightNumber.trim()}`
                                : '',
                              formData.actualArrivalTime.trim()
                                ? `الوصول الفعلي: ${formatReadableTime(formData.actualArrivalTime)}`
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}

                      {formData.hasReturnTrip && (
                        <div className="pt-2 border-t border-[#C9A96B]/10 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs text-[#DFC89B] font-semibold">رحلة العودة</span>
                            <span className="text-xs text-white tabular-nums">
                              {formatReadableDate(formData.returnDate)} ·{' '}
                              {formatReadableTime(formData.returnTime)}
                            </span>
                          </div>
                          <p className="text-white text-xs sm:text-sm">
                            {formData.returnPickupLocation}{' '}
                            <span className="text-[#C9A96B] mx-1">←</span>{' '}
                            {formData.returnDropoffLocation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Vehicle & Capacity Summary (Read-only with Edit returning to original input) */}
                    <div className="space-y-2 pb-3 border-b border-[#C9A96B]/15 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-label text-[#C9A96B] font-semibold">السيارة والسعة</span>
                        <div className="flex items-center gap-3">
                          {formData.passengersFromQuickBar && onEditPassengersAtEntry && (
                            <button
                              type="button"
                              onClick={() => onEditPassengersAtEntry(3)}
                              className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1 whitespace-nowrap"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>تعديل عدد الركاب</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setStep(2);
                              if (!formData.passengersFromQuickBar) {
                                setTimeout(() => {
                                  document.getElementById('bk-passengers')?.focus();
                                }, 40);
                              }
                            }}
                            className="text-xs text-[#91B9C8] hover:text-white inline-flex items-center gap-1 whitespace-nowrap"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>
                              {formData.passengersFromQuickBar
                                ? 'تعديل الحقائب والسيارة'
                                : 'تعديل الركاب والسيارة'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-white tabular-nums">
                          {`${pricingSummary.passengersCount ?? '—'} ${
                            pricingSummary.passengersCount === 1 ? 'راكب' : 'ركاب'
                          }`}{' '}
                          · {pricingSummary.luggageCount ?? '—'} حقائب
                        </span>
                        <span className="text-[#DFC89B] font-bold">
                          {effectiveCategoryMeta?.fullLabelAr || 'بعد المراجعة'}
                        </span>
                      </div>

                      {pricingSummary.outboundAllocation && (
                        <div className="flex items-center gap-3 pt-1">
                          <div className="w-24 aspect-video rounded-lg overflow-hidden bg-[#0B1522] shrink-0 border border-[#C9A96B]/25">
                            <img
                              key={pricingSummary.outboundAllocation.representativeVehicleId}
                              src={
                                REPRESENTATIVE_IMAGES_BY_MODEL_ID[
                                  pricingSummary.outboundAllocation.representativeVehicleId
                                ]
                              }
                              alt={`${effectiveCategoryMeta?.titleEn || pricingSummary.outboundAllocation.representativeModelNameEn} (${pricingSummary.outboundAllocation.representativeColorAr})`}
                              width={1000}
                              height={558}
                              loading="eager"
                              decoding="async"
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                          <p className="text-xs text-[#91B9C8] leading-relaxed">
                            {VEHICLE_ALLOCATION_DISCLAIMER_AR}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Prominent Pricing Box */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#9A9A96]">سعر الذهاب:</span>
                        <span className="text-white font-semibold tabular-nums">
                          {pricingSummary.outboundPriceEgp !== null
                            ? `${pricingSummary.outboundPriceEgp.toLocaleString('en-US')} جنيه مصري`
                            : QUOTE_REVIEW_MESSAGE_AR}
                        </span>
                      </div>
                      {formData.hasReturnTrip && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[#9A9A96]">سعر العودة:</span>
                          <span className="text-white font-semibold tabular-nums">
                            {pricingSummary.returnPriceEgp !== null
                              ? `${pricingSummary.returnPriceEgp.toLocaleString('en-US')} جنيه مصري`
                              : QUOTE_REVIEW_MESSAGE_AR}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C9A96B]/25">
                        <span className="font-subheading text-white">الإجمالي النهائي:</span>
                        <span className="text-lg sm:text-xl font-bold text-[#C9A96B] tabular-nums">
                          {pricingSummary.totalPriceEgp !== null
                            ? `${pricingSummary.totalPriceEgp.toLocaleString('en-US')} جنيه مصري`
                            : QUOTE_REVIEW_MESSAGE_AR}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Booking Data Consent */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#DFC89B] leading-relaxed select-none">
                      <input
                        type="checkbox"
                        checked={consentAccepted}
                        onChange={(e) => {
                          setConsentAccepted(e.target.checked);
                          if (e.target.checked) setConsentError(null);
                        }}
                        className="w-4 h-4 mt-0.5 rounded accent-[#C9A96B] shrink-0"
                      />
                      <span>
                        أوافق على معالجة بيانات الحجز للتواصل وتأكيد الخدمة وفقًا لسياسة الخصوصية والشروط المعتمدة لدى الوكيل ليموزين.
                      </span>
                    </label>
                    {consentError && (
                      <p role="alert" className="mt-1.5 text-xs text-red-300">
                        {consentError}
                      </p>
                    )}
                  </div>

                  {/* Primary Submit CTA */}
                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#C9A96B]/20">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#101D2D] border border-[#C9A96B]/25 text-sm text-[#9A9A96] hover:text-white inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto min-h-[50px] px-8 py-3 rounded-xl bg-[#C9A96B] hover:bg-[#d4b679] text-[#101D2D] font-bold text-sm sm:text-base shadow-lg inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span>إرسال الحجز</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
