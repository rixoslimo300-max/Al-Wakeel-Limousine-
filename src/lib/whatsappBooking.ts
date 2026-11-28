import { PricingRule, ServiceCategoryKey } from '../types';
import { VerifiedFleetModel, getVerifiedFleetModelById } from '../data/verifiedFleet';
import {
  CapacityEvaluationResult,
  QUOTE_REVIEW_MESSAGE_AR,
  SERVICE_CATEGORIES,
  TripQuoteResult,
  VEHICLE_ALLOCATION_DISCLAIMER_AR,
  VehicleAllocationResult,
  allocateVehicleForTrip,
  calculateTripQuote,
  evaluateVehicleCapacity,
  getLocalDateInputValue,
  normalizeLocationKey,
} from './bookingEngine';

export const WHATSAPP_COMPANY_PHONE_DISPLAY = '+201000053774';
export const WHATSAPP_COMPANY_PHONE_DIGITS = '201000053774';
export const WHATSAPP_CLICK_TO_CHAT_BASE = `https://wa.me/${WHATSAPP_COMPANY_PHONE_DIGITS}`;
export const WHATSAPP_WEB_FALLBACK_BASE = `https://web.whatsapp.com/send?phone=${WHATSAPP_COMPANY_PHONE_DIGITS}`;

export const BOOKING_PREPARED_INSTRUCTION_AR =
  'تم تجهيز طلب الحجز. يرجى استكمال الإرسال لإتمام وصول طلبك إلى الشركة. سيتم تأكيد الحجز بعد مراجعة الإدارة.';

export const BOOKING_OPEN_FAILED_INSTRUCTION_AR =
  'تعذر فتح رابط الإرسال. بيانات طلبك ما زالت محفوظة، ويمكنك المحاولة مرة أخرى.';

export const BOOKING_CONSENT_TEXT_AR =
  'أوافق على مشاركة بيانات الحجز مع شركة Al Wakeel Limousine بغرض مراجعة الطلب والتواصل معي بشأن الرحلة.';

export const TRIP_TYPE_OPTIONS = [
  'استقبال من المطار',
  'توصيل إلى المطار',
  'انتقال داخلي',
  'رحلة خاصة أو سياحية',
] as const;

export type TripTypeOption = (typeof TRIP_TYPE_OPTIONS)[number];

export interface WhatsAppBookingFormData {
  // Stage 1 — Trip Details (+ smart conditional Airport & Return)
  tripType: TripTypeOption;
  pickupLocation: string;
  dropoffLocation: string;
  tripDate: string;
  tripTime: string;
  airline: string;
  flightNumber: string;
  actualArrivalTime: string;

  hasReturnTrip: boolean;
  returnDate: string;
  returnTime: string;
  returnPickupLocation: string;
  returnDropoffLocation: string;
  returnUseDifferentCategory: boolean;
  returnServiceCategory: ServiceCategoryKey | null;

  // Stage 2 — Passengers, Luggage & Auto Category Allocation (Zero customer model choice)
  passengersCount: string;
  passengersFromQuickBar?: boolean;
  luggageCount: string;
  serviceCategory: ServiceCategoryKey | null;

  // Stage 3 — Customer Information & Review
  fullName: string;
  phone: string;
  companyName: string;
  notes?: string;
  consentAccepted?: boolean;
}

export type BookingWizardFormData = WhatsAppBookingFormData;
export type BookingFieldKey = keyof WhatsAppBookingFormData;
export type BookingValidationErrors = Partial<Record<BookingFieldKey, string>>;

function sanitizeText(value: string | undefined | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeTripType(raw: string | undefined | null): TripTypeOption {
  const cleaned = sanitizeText(raw);
  if ((TRIP_TYPE_OPTIONS as readonly string[]).includes(cleaned)) {
    return cleaned as TripTypeOption;
  }
  if (cleaned === 'رحلة خاصة' || cleaned === 'رحلة سياحية') {
    return 'رحلة خاصة أو سياحية';
  }
  return 'توصيل إلى المطار';
}

export function isValidPhoneInput(rawPhone: string): boolean {
  const trimmed = sanitizeText(rawPhone);
  if (!trimmed) return false;
  const digitsOnly = trimmed.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 16;
}

export function parseStrictInt(raw: string): number | null {
  const trimmed = sanitizeText(raw);
  if (!trimmed) return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  const num = Number(trimmed);
  return Number.isInteger(num) ? num : null;
}

export const parsePositiveInt = parseStrictInt;

/**
 * Return trip question is ONLY revealed after core outbound details are complete & valid.
 */
export function isCoreOutboundTripReady(data: WhatsAppBookingFormData): boolean {
  const pickup = sanitizeText(data.pickupLocation);
  const dropoff = sanitizeText(data.dropoffLocation);
  if (!TRIP_TYPE_OPTIONS.includes(data.tripType)) return false;
  if (!pickup || !dropoff) return false;
  if (normalizeLocationKey(pickup) === normalizeLocationKey(dropoff)) return false;
  if (!sanitizeText(data.tripDate) || !sanitizeText(data.tripTime)) return false;
  return true;
}

export function hasConfirmedPaxAndLuggage(data: WhatsAppBookingFormData): {
  confirmed: boolean;
  passengersCount: number | null;
  luggageCount: number | null;
} {
  const pax = parseStrictInt(data.passengersCount);
  const bags = parseStrictInt(data.luggageCount);
  const validPax = pax !== null && pax >= 1 ? pax : null;
  const validBags = bags !== null && bags >= 0 ? bags : null;
  return {
    confirmed: validPax !== null && validBags !== null,
    passengersCount: validPax,
    luggageCount: validBags,
  };
}

export interface ComputedBookingPricingSummary {
  countsConfirmed: boolean;
  passengersCount: number | null;
  luggageCount: number | null;
  outboundCapacity: CapacityEvaluationResult | null;
  outboundAllocation: VehicleAllocationResult | null;
  outboundRepresentativeVehicle: VerifiedFleetModel | null;
  outboundQuote: TripQuoteResult | null;
  outboundPriceEgp: number | null;
  returnCapacity: CapacityEvaluationResult | null;
  returnAllocation: VehicleAllocationResult | null;
  returnRepresentativeVehicle: VerifiedFleetModel | null;
  returnQuote: TripQuoteResult | null;
  returnPriceEgp: number | null;
  totalPriceEgp: number | null;
  requiresPriceReview: boolean;
  requiresVehicleReview: boolean;
}

export function computeBookingPricingSummary(
  data: WhatsAppBookingFormData,
  pricingRules: PricingRule[]
): ComputedBookingPricingSummary {
  const { confirmed, passengersCount, luggageCount } = hasConfirmedPaxAndLuggage(data);

  if (!confirmed || passengersCount === null || luggageCount === null) {
    return {
      countsConfirmed: false,
      passengersCount,
      luggageCount,
      outboundCapacity: null,
      outboundAllocation: null,
      outboundRepresentativeVehicle: null,
      outboundQuote: null,
      outboundPriceEgp: null,
      returnCapacity: null,
      returnAllocation: null,
      returnRepresentativeVehicle: null,
      returnQuote: null,
      returnPriceEgp: null,
      totalPriceEgp: null,
      requiresPriceReview: false,
      requiresVehicleReview: false,
    };
  }

  const outboundCapacity = evaluateVehicleCapacity({
    passengersCount,
    luggageCount,
    preferredCategory: data.serviceCategory,
  });

  const outboundAllocation = outboundCapacity.allocation;
  const outboundRepresentativeVehicle = getVerifiedFleetModelById(
    outboundAllocation.representativeVehicleId
  );

  const outboundQuote = calculateTripQuote({
    origin: data.pickupLocation,
    destination: data.dropoffLocation,
    passengersCount,
    luggageCount,
    serviceCategory: outboundCapacity.effectiveCategory,
    pricingRules,
  });

  const outboundPriceEgp =
    outboundQuote.valid && !outboundQuote.requiresCustomQuote && outboundQuote.fixedPrice !== null
      ? outboundQuote.fixedPrice
      : null;

  // Return trip evaluated independently using return route & central allocation
  const desiredReturnCategory = data.returnUseDifferentCategory
    ? data.returnServiceCategory
    : outboundCapacity.effectiveCategory;

  const returnCapacity = evaluateVehicleCapacity({
    passengersCount,
    luggageCount,
    preferredCategory: desiredReturnCategory,
  });

  const returnAllocation = returnCapacity.allocation;
  const returnRepresentativeVehicle = getVerifiedFleetModelById(
    returnAllocation.representativeVehicleId
  );

  const returnQuote = data.hasReturnTrip
    ? calculateTripQuote({
        origin: data.returnPickupLocation,
        destination: data.returnDropoffLocation,
        passengersCount,
        luggageCount,
        serviceCategory: returnCapacity.effectiveCategory,
        pricingRules,
      })
    : null;

  const returnPriceEgp =
    data.hasReturnTrip &&
    returnQuote &&
    returnQuote.valid &&
    !returnQuote.requiresCustomQuote &&
    returnQuote.fixedPrice !== null
      ? returnQuote.fixedPrice
      : null;

  const totalPriceEgp =
    outboundPriceEgp !== null && (!data.hasReturnTrip || returnPriceEgp !== null)
      ? outboundPriceEgp + (data.hasReturnTrip && returnPriceEgp !== null ? returnPriceEgp : 0)
      : null;

  const requiresPriceReview =
    outboundPriceEgp === null || (data.hasReturnTrip && returnPriceEgp === null);

  const requiresVehicleReview =
    outboundCapacity.requiresAdminVehicleReview ||
    (data.hasReturnTrip && returnCapacity.requiresAdminVehicleReview);

  return {
    countsConfirmed: true,
    passengersCount,
    luggageCount,
    outboundCapacity,
    outboundAllocation,
    outboundRepresentativeVehicle,
    outboundQuote,
    outboundPriceEgp,
    returnCapacity,
    returnAllocation,
    returnRepresentativeVehicle,
    returnQuote,
    returnPriceEgp,
    totalPriceEgp,
    requiresPriceReview,
    requiresVehicleReview,
  };
}

/**
 * Stage 1 Validator — Outbound Trip + Return Trip (if enabled)
 */
export function validateSectionB(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!TRIP_TYPE_OPTIONS.includes(data.tripType)) {
    errors.tripType = 'اختر نوع الخدمة.';
  }

  const pickup = sanitizeText(data.pickupLocation);
  const dropoff = sanitizeText(data.dropoffLocation);

  if (!pickup) {
    errors.pickupLocation = 'حدد نقطة التحرك.';
  }

  if (!dropoff) {
    errors.dropoffLocation = 'حدد الوجهة.';
  }

  if (pickup && dropoff && normalizeLocationKey(pickup) === normalizeLocationKey(dropoff)) {
    errors.dropoffLocation = 'الوجهة مطابقة لنقطة التحرك.';
  }

  const today = getLocalDateInputValue();
  const tripDateVal = sanitizeText(data.tripDate);
  if (!tripDateVal) {
    errors.tripDate = 'حدد تاريخ الرحلة.';
  } else if (tripDateVal < today) {
    errors.tripDate = 'تاريخ الرحلة لا يمكن أن يكون في الماضي.';
  }

  if (!sanitizeText(data.tripTime)) {
    errors.tripTime = 'حدد وقت الرحلة.';
  }

  if (data.hasReturnTrip) {
    const returnErrors = validateReturnSection(data);
    Object.assign(errors, returnErrors);
  }

  return errors;
}

export function validateReturnSection(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};
  if (!data.hasReturnTrip) return errors;

  const today = getLocalDateInputValue();
  const retDate = sanitizeText(data.returnDate);
  const retTime = sanitizeText(data.returnTime);
  const retPickup = sanitizeText(data.returnPickupLocation);
  const retDropoff = sanitizeText(data.returnDropoffLocation);

  if (!retDate) {
    errors.returnDate = 'حدد تاريخ العودة.';
  } else if (retDate < today) {
    errors.returnDate = 'تاريخ العودة لا يمكن أن يكون في الماضي.';
  }

  if (!retTime) {
    errors.returnTime = 'حدد وقت العودة.';
  }

  if (!retPickup) {
    errors.returnPickupLocation = 'حدد نقطة التحرك للعودة.';
  }

  if (!retDropoff) {
    errors.returnDropoffLocation = 'حدد الوجهة للعودة.';
  }

  if (
    retPickup &&
    retDropoff &&
    normalizeLocationKey(retPickup) === normalizeLocationKey(retDropoff)
  ) {
    errors.returnDropoffLocation = 'الوجهة مطابقة لنقطة التحرك في العودة.';
  }

  const outDate = sanitizeText(data.tripDate);
  const outTime = sanitizeText(data.tripTime);

  if (outDate && retDate) {
    if (retDate < outDate) {
      errors.returnDate = 'تاريخ العودة يسبق الذهاب.';
    } else if (retDate === outDate && outTime && retTime && retTime <= outTime) {
      errors.returnTime = 'وقت العودة يجب أن يكون بعد الذهاب.';
    }
  }

  return errors;
}

/**
 * Stage 2 Validator — Confirmed Passengers (>=1), Confirmed Luggage (>=0), Auto-Allocated Category
 */
export function validateSectionC(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  const parsedPassengers = parseStrictInt(data.passengersCount);
  if (parsedPassengers === null || parsedPassengers < 1) {
    errors.passengersCount = 'حدد عدد الركاب (1 فأكثر).';
  }

  const parsedLuggage = parseStrictInt(data.luggageCount);
  if (parsedLuggage === null || parsedLuggage < 0) {
    errors.luggageCount = 'حدد عدد الحقائب (0 فأكثر).';
  }

  if (parsedPassengers !== null && parsedPassengers >= 1 && parsedLuggage !== null && parsedLuggage >= 0) {
    const alloc = allocateVehicleForTrip({
      passengersCount: parsedPassengers,
      luggageCount: parsedLuggage,
      preferredCategory: data.serviceCategory,
    });

    if (
      data.serviceCategory &&
      !alloc.allowedCategories.includes(data.serviceCategory)
    ) {
      errors.serviceCategory =
        alloc.noticeAr || 'اختر فئة سيارة مناسبة لعدد الركاب والحقائب.';
    }
  }

  return errors;
}

/**
 * Stage 3 Validator — Customer Information
 */
export function validateSectionA(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!sanitizeText(data.fullName)) {
    errors.fullName = 'أدخل الاسم بالكامل.';
  }

  if (!sanitizeText(data.phone)) {
    errors.phone = 'أدخل رقم الهاتف.';
  } else if (!isValidPhoneInput(data.phone)) {
    errors.phone = 'أدخل رقم هاتف صحيحًا.';
  }

  return errors;
}

export function validateSectionD(_data: WhatsAppBookingFormData): BookingValidationErrors {
  return {};
}

export function validateWhatsAppBookingForm(data: WhatsAppBookingFormData): {
  isValid: boolean;
  errors: BookingValidationErrors;
  firstInvalidStep: 1 | 2 | 3 | null;
} {
  const err1 = validateSectionB(data);
  const err2 = validateSectionC(data);
  const err3 = validateSectionA(data);

  const errors: BookingValidationErrors = {
    ...err1,
    ...err2,
    ...err3,
  };

  let firstInvalidStep: 1 | 2 | 3 | null = null;
  if (Object.keys(err1).length > 0) firstInvalidStep = 1;
  else if (Object.keys(err2).length > 0) firstInvalidStep = 2;
  else if (Object.keys(err3).length > 0) firstInvalidStep = 3;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstInvalidStep,
  };
}

export function formatReadableDate(dateStr: string): string {
  const trimmed = sanitizeText(dateStr);
  if (!trimmed) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function formatReadableTime(timeStr: string): string {
  const trimmed = sanitizeText(timeStr);
  if (!trimmed) return '';
  const match = /^(\d{2}):(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;
  const hours = Number(match[1]);
  const minutes = match[2];
  if (Number.isNaN(hours) || hours < 0 || hours > 23) return trimmed;
  const period = hours >= 12 ? 'مساءً' : 'صباحاً';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const padded12 = String(hour12).padStart(2, '0');
  return `${padded12}:${minutes} ${period}`;
}

function formatPriceLineValue(priceEgp: number | null): string {
  if (priceEgp !== null && Number.isFinite(priceEgp) && priceEgp > 0) {
    return `${priceEgp.toLocaleString('en-US')} جنيه مصري`;
  }
  return QUOTE_REVIEW_MESSAGE_AR;
}

/**
 * Generates a structured Arabic dispatch message aligned with Smart Vehicle Allocation:
 * Includes allocated service category and company-assigned operational vehicle notice (no customer model choice).
 */
export function buildStructuredWhatsAppBookingMessage(
  data: WhatsAppBookingFormData,
  pricingSummary?: ComputedBookingPricingSummary
): string {
  const summary = pricingSummary || computeBookingPricingSummary(data, []);
  const paxCount = summary.passengersCount ?? (parseStrictInt(data.passengersCount) || 1);
  const bagsCount = summary.luggageCount ?? (parseStrictInt(data.luggageCount) || 0);
  const alloc =
    summary.outboundAllocation ||
    allocateVehicleForTrip({
      passengersCount: paxCount,
      luggageCount: bagsCount,
      preferredCategory: data.serviceCategory,
    });
  const finalOutboundCategoryMeta = SERVICE_CATEGORIES[alloc.effectiveCategory];

  const lines: string[] = [
    'طلب حجز جديد – Al Wakeel Limousine',
    '',
    'بيانات العميل:',
    `الاسم: ${sanitizeText(data.fullName)}`,
    `رقم الهاتف: ${sanitizeText(data.phone)}`,
  ];

  const company = sanitizeText(data.companyName);
  if (company) {
    lines.push(`الشركة: ${company}`);
  }

  lines.push(
    '',
    'تفاصيل الرحلة:',
    `نوع الخدمة: ${sanitizeText(data.tripType)}`,
    `من: ${sanitizeText(data.pickupLocation)}`,
    `إلى: ${sanitizeText(data.dropoffLocation)}`,
    `التاريخ: ${formatReadableDate(data.tripDate)}`,
    `الوقت: ${formatReadableTime(data.tripTime)}`
  );

  if (data.tripType === 'استقبال من المطار') {
    const airline = sanitizeText(data.airline);
    const flightNumber = sanitizeText(data.flightNumber);
    const actualArrival = sanitizeText(data.actualArrivalTime);
    if (airline) lines.push(`شركة الطيران: ${airline}`);
    if (flightNumber) lines.push(`رقم الرحلة الجوية: ${flightNumber}`);
    if (actualArrival) lines.push(`موعد الوصول الفعلي: ${formatReadableTime(actualArrival)}`);
  }

  lines.push(
    '',
    'الركاب والفئة المخصصة:',
    `عدد الركاب: ${paxCount}`,
    `عدد الحقائب: ${bagsCount}`,
    `فئة الخدمة المخصصة: ${finalOutboundCategoryMeta.fullLabelAr}`,
    `الفئة التمثيلية للسعة: ${alloc.representativeModelNameEn} (${alloc.representativeColorAr}) — تتولى الشركة وحدها تعيين السيارة الفعلية`
  );

  if (data.hasReturnTrip) {
    const returnAlloc =
      summary.returnAllocation ||
      allocateVehicleForTrip({
        passengersCount: paxCount,
        luggageCount: bagsCount,
        preferredCategory: data.returnUseDifferentCategory
          ? data.returnServiceCategory
          : alloc.effectiveCategory,
      });
    const finalReturnCategoryMeta = SERVICE_CATEGORIES[returnAlloc.effectiveCategory];
    lines.push(
      '',
      'تفاصيل العودة:',
      `من: ${sanitizeText(data.returnPickupLocation)}`,
      `إلى: ${sanitizeText(data.returnDropoffLocation)}`,
      `التاريخ: ${formatReadableDate(data.returnDate)}`,
      `الوقت: ${formatReadableTime(data.returnTime)}`,
      `فئة الخدمة للعودة: ${finalReturnCategoryMeta.fullLabelAr}`
    );
  }

  lines.push('', `سعر الذهاب: ${formatPriceLineValue(summary.outboundPriceEgp)}`);

  if (data.hasReturnTrip) {
    lines.push(`سعر العودة: ${formatPriceLineValue(summary.returnPriceEgp)}`);
  }

  lines.push(`الإجمالي: ${formatPriceLineValue(summary.totalPriceEgp)}`);

  const notes = sanitizeText(data.notes);
  if (notes) {
    lines.push('', 'ملاحظات إضافية:', notes);
  }

  lines.push('', `ملاحظة: ${VEHICLE_ALLOCATION_DISCLAIMER_AR}`);

  return lines.join('\n');
}

export function buildWhatsAppClickToChatUrl(message: string): string {
  return `${WHATSAPP_CLICK_TO_CHAT_BASE}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppWebFallbackUrl(message: string): string {
  return `${WHATSAPP_WEB_FALLBACK_BASE}&text=${encodeURIComponent(message)}`;
}

export function openWhatsAppSafely(url: string): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch {
    return false;
  }
}

export function inferTripTypeFromRoute(origin: string, destination: string): TripTypeOption {
  const orig = sanitizeText(origin);
  const dest = sanitizeText(destination);

  if (orig.includes('مطار')) return 'استقبال من المطار';
  if (dest.includes('مطار')) return 'توصيل إلى المطار';
  if (
    dest.includes('الساحل') ||
    dest.includes('مارينا') ||
    dest.includes('العلمين') ||
    orig.includes('الساحل')
  ) {
    return 'رحلة خاصة أو سياحية';
  }
  return 'انتقال داخلي';
}
