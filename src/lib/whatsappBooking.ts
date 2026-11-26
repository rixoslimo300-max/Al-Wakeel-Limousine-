export const WHATSAPP_COMPANY_PHONE_DISPLAY = '+201000053774';
export const WHATSAPP_COMPANY_PHONE_DIGITS = '201000053774';
export const WHATSAPP_CLICK_TO_CHAT_BASE = `https://wa.me/${WHATSAPP_COMPANY_PHONE_DIGITS}`;
export const WHATSAPP_WEB_FALLBACK_BASE = `https://web.whatsapp.com/send?phone=${WHATSAPP_COMPANY_PHONE_DIGITS}`;

export const WHATSAPP_CONSENT_TEXT_AR =
  'أوافق على مشاركة بيانات الحجز مع شركة الوكيل ليموزين بغرض مراجعة الطلب والتواصل معي بشأن الرحلة.';

export const WHATSAPP_PREPARED_INSTRUCTION_AR =
  'تم تجهيز طلبك. يرجى الضغط على إرسال داخل واتساب لإتمام إرسال الطلب إلى الشركة. سيتم تأكيد الحجز بعد مراجعة الإدارة.';

export const TRIP_TYPE_OPTIONS = [
  'استقبال من المطار',
  'توصيل إلى المطار',
  'انتقال داخلي',
  'رحلة خاصة',
  'رحلة سياحية',
] as const;

export type TripTypeOption = (typeof TRIP_TYPE_OPTIONS)[number];

export const VEHICLE_PREFERENCE_OPTIONS = [
  'سيدان',
  'SUV',
  'Xpander',
  'سيارة عائلية',
  'فان / Hiace',
  'لا توجد تفضيلات',
] as const;

export type VehiclePreferenceOption = (typeof VEHICLE_PREFERENCE_OPTIONS)[number];

export interface WhatsAppBookingFormData {
  // Section A — Customer Information
  fullName: string;
  phone: string;
  companyName: string;

  // Section B — Trip Information
  tripType: TripTypeOption;
  pickupLocation: string;
  dropoffLocation: string;
  tripDate: string;
  tripTime: string;
  airline: string;
  flightNumber: string;
  actualArrivalTime: string;

  // Section C — Passengers & Vehicle Requirements
  passengersCount: string;
  luggageCount: string;
  vehiclePreference: VehiclePreferenceOption | '';
  hasReturnTrip: boolean;
  returnDate: string;
  returnTime: string;
  returnPickupLocation: string;
  returnDropoffLocation: string;
  notes: string;

  // Section D — Consent
  consentAccepted: boolean;
}

export type BookingFieldKey = keyof WhatsAppBookingFormData;
export type BookingValidationErrors = Partial<Record<BookingFieldKey, string>>;

function sanitizeText(value: string | undefined | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidPhoneInput(rawPhone: string): boolean {
  const trimmed = sanitizeText(rawPhone);
  if (!trimmed) return false;
  const digitsOnly = trimmed.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 16;
}

export function parsePositiveInt(raw: string): number | null {
  const trimmed = sanitizeText(raw);
  if (!trimmed) return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  const num = Number(trimmed);
  return Number.isInteger(num) ? num : null;
}

export function validateSectionA(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!sanitizeText(data.fullName)) {
    errors.fullName = 'يرجى إدخال الاسم بالكامل.';
  }

  if (!sanitizeText(data.phone)) {
    errors.phone = 'يرجى إدخال رقم الهاتف أو واتساب.';
  } else if (!isValidPhoneInput(data.phone)) {
    errors.phone = 'يرجى إدخال رقم هاتف صحيح.';
  }

  return errors;
}

export function validateSectionB(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!TRIP_TYPE_OPTIONS.includes(data.tripType)) {
    errors.tripType = 'يرجى اختيار نوع الرحلة.';
  }

  if (!sanitizeText(data.pickupLocation)) {
    errors.pickupLocation = 'يرجى تحديد مكان التحرك.';
  }

  if (!sanitizeText(data.dropoffLocation)) {
    errors.dropoffLocation = 'يرجى تحديد الوجهة.';
  }

  if (!sanitizeText(data.tripDate)) {
    errors.tripDate = 'يرجى تحديد تاريخ الرحلة.';
  }

  if (!sanitizeText(data.tripTime)) {
    errors.tripTime = 'يرجى تحديد وقت التحرك.';
  }

  return errors;
}

export function validateSectionC(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  const parsedPassengers = parsePositiveInt(data.passengersCount);
  if (parsedPassengers === null || parsedPassengers < 1) {
    errors.passengersCount = 'يجب أن يكون عدد الركاب 1 على الأقل.';
  }

  if (sanitizeText(data.luggageCount)) {
    const parsedLuggage = parsePositiveInt(data.luggageCount);
    if (parsedLuggage === null || parsedLuggage < 0) {
      errors.luggageCount = 'يرجى إدخال عدد حقائب صحيح (0 أو أكثر).';
    }
  }

  if (data.hasReturnTrip) {
    if (!sanitizeText(data.returnDate)) {
      errors.returnDate = 'يرجى تحديد تاريخ رحلة العودة.';
    }
    if (!sanitizeText(data.returnTime)) {
      errors.returnTime = 'يرجى تحديد وقت رحلة العودة.';
    }
    if (!sanitizeText(data.returnPickupLocation)) {
      errors.returnPickupLocation = 'يرجى تحديد مكان العودة.';
    }
    if (!sanitizeText(data.returnDropoffLocation)) {
      errors.returnDropoffLocation = 'يرجى تحديد وجهة العودة.';
    }
  }

  return errors;
}

export function validateSectionD(data: WhatsAppBookingFormData): BookingValidationErrors {
  const errors: BookingValidationErrors = {};
  if (!data.consentAccepted) {
    errors.consentAccepted = 'يرجى الموافقة على مشاركة بيانات الحجز لإتمام تجهيز الطلب.';
  }
  return errors;
}

export function validateWhatsAppBookingForm(data: WhatsAppBookingFormData): {
  isValid: boolean;
  errors: BookingValidationErrors;
  firstInvalidStep: 1 | 2 | 3 | 4 | null;
} {
  const errA = validateSectionA(data);
  const errB = validateSectionB(data);
  const errC = validateSectionC(data);
  const errD = validateSectionD(data);

  const errors: BookingValidationErrors = {
    ...errA,
    ...errB,
    ...errC,
    ...errD,
  };

  let firstInvalidStep: 1 | 2 | 3 | 4 | null = null;
  if (Object.keys(errA).length > 0) firstInvalidStep = 1;
  else if (Object.keys(errB).length > 0) firstInvalidStep = 2;
  else if (Object.keys(errC).length > 0) firstInvalidStep = 3;
  else if (Object.keys(errD).length > 0) firstInvalidStep = 4;

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
  return `${padded12}:${minutes} ${period} (${trimmed})`;
}

/**
 * Generates the exact WhatsApp message template requested by Al Wakeel Limousine,
 * safely omitting any empty optional fields and never emitting undefined/null placeholders.
 */
export function buildStructuredWhatsAppBookingMessage(data: WhatsAppBookingFormData): string {
  const lines: string[] = [
    '━━━━━━━━━━━━━━━━━━',
    'طلب حجز جديد',
    'Al Wakeel Limousine',
    '━━━━━━━━━━━━━━━━━━',
    '',
    'أولاً: بيانات العميل',
    '',
    `الاسم: ${sanitizeText(data.fullName)}`,
    `رقم الهاتف: ${sanitizeText(data.phone)}`,
  ];

  const company = sanitizeText(data.companyName);
  if (company) {
    lines.push(`الشركة: ${company}`);
  }

  lines.push(
    '',
    'ثانياً: تفاصيل الرحلة',
    '',
    `نوع الرحلة: ${sanitizeText(data.tripType)}`,
    `مكان التحرك: ${sanitizeText(data.pickupLocation)}`,
    `الوجهة: ${sanitizeText(data.dropoffLocation)}`,
    `التاريخ: ${formatReadableDate(data.tripDate)}`,
    `وقت التحرك: ${formatReadableTime(data.tripTime)}`
  );

  const airline = sanitizeText(data.airline);
  if (airline) {
    lines.push(`شركة الطيران: ${airline}`);
  }

  const flightNumber = sanitizeText(data.flightNumber);
  if (flightNumber) {
    lines.push(`رقم الرحلة الجوية: ${flightNumber}`);
  }

  const actualArrival = sanitizeText(data.actualArrivalTime);
  if (actualArrival) {
    lines.push(`موعد الوصول الفعلي: ${formatReadableTime(actualArrival)}`);
  }

  lines.push(
    '',
    'ثالثاً: تفاصيل التنفيذ',
    '',
    `عدد الركاب: ${sanitizeText(data.passengersCount)}`
  );

  const luggage = sanitizeText(data.luggageCount);
  if (luggage) {
    lines.push(`عدد الحقائب: ${luggage}`);
  }

  const vehicle = sanitizeText(data.vehiclePreference);
  if (vehicle) {
    lines.push(`نوع السيارة: ${vehicle}`);
  }

  lines.push(`رحلة عودة: ${data.hasReturnTrip ? 'نعم' : 'لا'}`);

  if (data.hasReturnTrip) {
    lines.push(
      '',
      'تفاصيل رحلة العودة:',
      `التاريخ: ${formatReadableDate(data.returnDate)}`,
      `الوقت: ${formatReadableTime(data.returnTime)}`,
      `من: ${sanitizeText(data.returnPickupLocation)}`,
      `إلى: ${sanitizeText(data.returnDropoffLocation)}`
    );
  }

  const notes = sanitizeText(data.notes);
  if (notes) {
    lines.push('', `ملاحظات إضافية: ${notes}`);
  }

  lines.push(
    '',
    '━━━━━━━━━━━━━━━━━━',
    'مصدر الطلب: تطبيق Al Wakeel Limousine',
    'الحالة: طلب جديد بانتظار مراجعة الشركة',
    '━━━━━━━━━━━━━━━━━━'
  );

  return lines.join('\n');
}

export function buildWhatsAppClickToChatUrl(message: string): string {
  return `${WHATSAPP_CLICK_TO_CHAT_BASE}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppWebFallbackUrl(message: string): string {
  return `${WHATSAPP_WEB_FALLBACK_BASE}&text=${encodeURIComponent(message)}`;
}

/**
 * Opens the WhatsApp Click-to-Chat link safely via an anchor click without window.open/alert,
 * returning whether the programmatic trigger succeeded without throwing.
 */
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
    return 'رحلة سياحية';
  }
  return 'انتقال داخلي';
}
