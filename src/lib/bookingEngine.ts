import { PricingRule, ServiceCategoryKey } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '+201000053774';
export const OFFICIAL_WHATSAPP_BASE_URL = 'https://wa.me/201000053774';
export const OFFICIAL_TEL_HREF = 'tel:+201000053774';

export const UNLISTED_ROUTE_QUOTE_MESSAGE_AR = 'يرجى التواصل معنا للحصول على عرض سعر خاص';

export interface ServiceCategoryMeta {
  key: ServiceCategoryKey;
  code: string;
  titleAr: string;
  titleEn: string;
  fullLabelAr: string;
  descriptionAr: string;
  legacyVehicleCategoryId: string;
  minPassengers: number;
  maxPassengers: number;
}

export const SERVICE_CATEGORIES: Record<ServiceCategoryKey, ServiceCategoryMeta> = {
  sedan_comfort: {
    key: 'sedan_comfort',
    code: 'COMFORT SEDAN',
    titleAr: 'سيدان مريحة',
    titleEn: 'Comfort Sedan',
    fullLabelAr: 'Comfort Sedan — سيدان مريحة',
    descriptionAr:
      'تجربة انتقال خاصة تجمع بين الراحة والعملية، مع خصوصية كاملة طوال الرحلة، لتصل إلى وجهتك بسهولة وهدوء.',
    legacyVehicleCategoryId: 'sedan-luxury',
    minPassengers: 1,
    maxPassengers: 3,
  },
  suv_premium: {
    key: 'suv_premium',
    code: 'PREMIUM SUV',
    titleAr: 'SUV بريميوم',
    titleEn: 'Premium SUV',
    fullLabelAr: 'Premium SUV — SUV بريميوم',
    descriptionAr:
      'ارتقِ بتجربة انتقالك مع سيارة SUV خاصة توفر مساحة أرحب وراحة أكبر وخصوصية كاملة، لتصل إلى وجهتك بتجربة أكثر تميزًا.',
    legacyVehicleCategoryId: 'vip-suv',
    minPassengers: 1,
    maxPassengers: 3,
  },
  mini_van: {
    key: 'mini_van',
    code: 'MINI VAN',
    titleAr: 'ميني فان',
    titleEn: 'Mini Van',
    fullLabelAr: 'MINI VAN — ميني فان',
    descriptionAr:
      'مساحة مناسبة للرحلات التي تضم من 4 إلى 5 ركاب، مع توفير السيارة المناسبة لاحتياجات المجموعة.',
    legacyVehicleCategoryId: 'family-van',
    minPassengers: 4,
    maxPassengers: 5,
  },
};

export const AIRPORT_TRANSFER_ADVANTAGES: string[] = [
  '45 دقيقة انتظار مجانية عند استقبال رحلات المطار.',
  '30 دقيقة انتظار مجانية للرحلات العادية.',
  'رسوم الطريق ودخول المطار مشمولة في السعر.',
  'لا توجد رسوم مسبقة عند الحجز.',
  'إمكانية التعديل أو الإلغاء وفق سياسة الحجز.',
  'رحلة خاصة وخصوصية كاملة دون مشاركة السيارة مع أي راكب آخر.',
  'حجز وتأكيد سريع عبر واتساب.',
];

export type DailyRentalPackageId = 'daily-rental-8h' | 'daily-rental-12h';

export interface DailyRentalPackage {
  id: DailyRentalPackageId;
  titleEn: string;
  titleAr: string;
  priceEgp: number;
  maxHours: number;
  maxKm: number;
  durationLabelAr: string;
  distanceLabelAr: string;
  scopeLabelAr: string;
  descriptionAr: string;
}

export const DAILY_RENTAL_HEADING_AR = 'سيارتك الخاصة طوال اليوم';
export const DAILY_RENTAL_INTRO_AR =
  'استمتع بحرية التنقل داخل الإسكندرية بسيارة خاصة تناسب جدولك اليومي، سواء للمشاوير المتعددة أو الاجتماعات أو الارتباطات الشخصية، وفق مدة الاستخدام والمسافة المحددة لكل باقة.';

export const DAILY_RENTAL_PACKAGES: DailyRentalPackage[] = [
  {
    id: 'daily-rental-8h',
    titleEn: 'Daily Rental – 8 Hours',
    titleAr: 'تأجير يومي – 8 ساعات',
    priceEgp: 2800,
    maxHours: 8,
    maxKm: 120,
    durationLabelAr: 'حتى 8 ساعات',
    distanceLabelAr: 'حتى 120 كم',
    scopeLabelAr: 'داخل الإسكندرية',
    descriptionAr:
      'استمتع بحرية التنقل داخل الإسكندرية بسيارة خاصة تناسب جدولك اليومي، سواء للمشاوير المتعددة أو الاجتماعات أو الارتباطات الشخصية، وفق مدة الاستخدام والمسافة المحددة لهذه الباقة.',
  },
  {
    id: 'daily-rental-12h',
    titleEn: 'Daily Rental – 12 Hours',
    titleAr: 'تأجير يومي – 12 ساعة',
    priceEgp: 3600,
    maxHours: 12,
    maxKm: 150,
    durationLabelAr: 'حتى 12 ساعة',
    distanceLabelAr: 'حتى 150 كم',
    scopeLabelAr: 'داخل الإسكندرية',
    descriptionAr:
      'استمتع بحرية التنقل داخل الإسكندرية بسيارة خاصة تناسب جدولك اليومي، سواء للمشاوير المتعددة أو الاجتماعات أو الارتباطات الشخصية، وفق مدة الاستخدام والمسافة المحددة لهذه الباقة.',
  },
];

export function getDailyRentalPackage(packageId?: string | null): DailyRentalPackage {
  return (
    DAILY_RENTAL_PACKAGES.find((pkg) => pkg.id === packageId) ||
    DAILY_RENTAL_PACKAGES[0]
  );
}

/**
 * Internal operational fleet options used EXCLUSIVELY inside AdminDashboard.
 * Never exposed to customers during booking selection.
 * Note: Mini Van uses only operationally approved Mini Van vehicles, NEVER SUVs.
 */
export const INTERNAL_ASSIGNMENT_POOLS: Record<ServiceCategoryKey, string[]> = {
  sedan_comfort: [
    'Hyundai Elantra CN7',
    'Toyota Corolla',
    'Kia Grand Cerato',
  ],
  suv_premium: [
    'SOUEAST S07',
    'JETOUR X70',
    'Hyundai Tucson 2026',
    'Kia Sportage 2026',
  ],
  mini_van: [
    'مركبة ميني فان معتمدة (تشغيلية - 7 مقاعد)',
    'تويوتا هاي إيس / ميني فان معتمدة',
  ],
};

export interface JourneyLocationOption {
  id: string;
  labelAr: string;
  isAirport: boolean;
}

export const STANDARD_JOURNEY_LOCATIONS: JourneyLocationOption[] = [
  { id: 'alexandria', labelAr: 'الإسكندرية', isAirport: false },
  { id: 'borg-el-arab-airport', labelAr: 'مطار برج العرب الدولي', isAirport: true },
  { id: 'cairo-airport', labelAr: 'مطار القاهرة الدولي', isAirport: true },
  { id: 'sphinx-airport', labelAr: 'مطار سفنكس الدولي', isAirport: true },
];

export const OFFICIAL_ROUTE_PRICING: PricingRule[] = [
  {
    id: 'route-alex-borg',
    serviceId: 'borg-el-arab-airport',
    vehicleCategoryId: 'sedan-luxury',
    routeName: 'الإسكندرية ↔ مطار برج العرب الدولي',
    origin: 'الإسكندرية',
    destination: 'مطار برج العرب الدولي',
    baseRate: 850,
    sedanPrice: 850,
    suvPrice: 1200,
    miniVanPrice: null,
    isActive: true,
    bidirectional: true,
    notes: 'سعر ثابت لاتجاه واحد بالاتجاهين (ذهاب أو عودة).',
  },
  {
    id: 'route-alex-cairo',
    serviceId: 'cairo-airport',
    vehicleCategoryId: 'sedan-luxury',
    routeName: 'الإسكندرية ↔ مطار القاهرة الدولي',
    origin: 'الإسكندرية',
    destination: 'مطار القاهرة الدولي',
    baseRate: 1850,
    sedanPrice: 1850,
    suvPrice: 2200,
    miniVanPrice: null,
    isActive: true,
    bidirectional: true,
    notes: 'سعر ثابت لاتجاه واحد بالاتجاهين (ذهاب أو عودة).',
  },
  {
    id: 'route-alex-sphinx',
    serviceId: 'sphinx-airport',
    vehicleCategoryId: 'sedan-luxury',
    routeName: 'الإسكندرية ↔ مطار سفنكس الدولي',
    origin: 'الإسكندرية',
    destination: 'مطار سفنكس الدولي',
    baseRate: 1850,
    sedanPrice: 1850,
    suvPrice: 2200,
    miniVanPrice: null,
    isActive: true,
    bidirectional: true,
    notes: 'سعر ثابت لاتجاه واحد بالاتجاهين (ذهاب أو عودة).',
  },
];

const LOCATION_ALIAS_MAP: Array<{ canonical: string; patterns: string[] }> = [
  {
    canonical: 'alexandria',
    patterns: ['الإسكندرية', 'الاسكندرية', 'اسكندرية', 'إسكندرية', 'alexandria', 'alex'],
  },
  {
    canonical: 'borg-el-arab-airport',
    patterns: [
      'مطار برج العرب الدولي',
      'مطار برج العرب',
      'برج العرب',
      'borg el arab airport',
      'borg el arab international airport',
      'hbe',
    ],
  },
  {
    canonical: 'cairo-airport',
    patterns: [
      'مطار القاهرة الدولي',
      'مطار القاهرة',
      'cairo international airport',
      'cairo airport',
      'cai',
    ],
  },
  {
    canonical: 'sphinx-airport',
    patterns: [
      'مطار سفنكس الدولي',
      'مطار سفنكس',
      'سفنكس',
      'sphinx international airport',
      'sphinx airport',
      'spx',
    ],
  },
];

export function normalizeLocationKey(raw: string): string {
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cleaned) return '';

  for (const entry of LOCATION_ALIAS_MAP) {
    if (entry.patterns.some((p) => p.toLowerCase() === cleaned)) {
      return entry.canonical;
    }
  }
  return cleaned;
}

export function getAllowedCategoriesForPassengers(passengersCount: number): ServiceCategoryKey[] {
  if (!Number.isInteger(passengersCount) || passengersCount < 1) {
    return [];
  }
  if (passengersCount <= 3) {
    return ['sedan_comfort', 'suv_premium'];
  }
  if (passengersCount <= 5) {
    return ['mini_van'];
  }
  return [];
}

export function getDefaultCategoryForPassengers(passengersCount: number): ServiceCategoryKey | null {
  if (!Number.isInteger(passengersCount) || passengersCount < 1 || passengersCount > 5) {
    return null;
  }
  return passengersCount <= 3 ? 'sedan_comfort' : 'mini_van';
}

export function extractStructuredRouteRules(rules: PricingRule[]): PricingRule[] {
  const structured = rules.filter(
    (r) => Boolean(r.origin?.trim() && r.destination?.trim())
  );
  if (structured.length === 0) {
    return OFFICIAL_ROUTE_PRICING;
  }
  return structured;
}

export interface TripQuoteResult {
  valid: boolean;
  requiresSpecialArrangement: boolean;
  requiresCustomQuote: boolean;
  quoteReason?: 'minivan_unconfigured' | 'unlisted_route' | 'invalid_passengers' | 'same_location' | 'category_mismatch';
  fixedPrice: number | null;
  matchedRuleId?: string;
  matchedRouteName?: string;
  messageAr?: string;
}

export function calculateTripQuote(params: {
  origin: string;
  destination: string;
  passengersCount: number;
  serviceCategory: ServiceCategoryKey | null;
  pricingRules: PricingRule[];
}): TripQuoteResult {
  const { origin, destination, passengersCount, serviceCategory, pricingRules } = params;

  if (!Number.isInteger(passengersCount) || passengersCount < 1) {
    return {
      valid: false,
      requiresSpecialArrangement: false,
      requiresCustomQuote: false,
      quoteReason: 'invalid_passengers',
      fixedPrice: null,
      messageAr: 'يرجى إدخال عدد ركاب صحيح (1 فأكثر).',
    };
  }

  if (passengersCount > 5) {
    return {
      valid: false,
      requiresSpecialArrangement: true,
      requiresCustomQuote: false,
      quoteReason: 'invalid_passengers',
      fixedPrice: null,
      messageAr: 'للرحلات التي تضم أكثر من 5 ركاب، يرجى التواصل معنا مباشرة لتنسيق الترتيب الخاص المناسب.',
    };
  }

  const originKey = normalizeLocationKey(origin);
  const destKey = normalizeLocationKey(destination);

  if (originKey && destKey && originKey === destKey) {
    return {
      valid: false,
      requiresSpecialArrangement: false,
      requiresCustomQuote: false,
      quoteReason: 'same_location',
      fixedPrice: null,
      messageAr: 'لا يمكن أن تكون نقطة الانطلاق والوجهة المقصودة متطابقتين.',
    };
  }

  const allowedCategories = getAllowedCategoriesForPassengers(passengersCount);
  if (!serviceCategory || !allowedCategories.includes(serviceCategory)) {
    return {
      valid: false,
      requiresSpecialArrangement: false,
      requiresCustomQuote: false,
      quoteReason: 'category_mismatch',
      fixedPrice: null,
      messageAr:
        passengersCount <= 3
          ? 'تتوفر فئات Comfort Sedan وPremium SUV لعدد 1 إلى 3 ركاب.'
          : 'فئة ميني فان إلزامية لعدد 4 إلى 5 ركاب.',
    };
  }

  const activeRules = extractStructuredRouteRules(pricingRules).filter(
    (r) => r.isActive !== false
  );

  const matchedRule = activeRules.find((r) => {
    const rOrigin = normalizeLocationKey(r.origin || '');
    const rDest = normalizeLocationKey(r.destination || '');
    if (!rOrigin || !rDest || !originKey || !destKey) return false;
    const direct = rOrigin === originKey && rDest === destKey;
    const reverse = r.bidirectional !== false && rOrigin === destKey && rDest === originKey;
    return direct || reverse;
  });

  if (!matchedRule) {
    return {
      valid: true,
      requiresSpecialArrangement: false,
      requiresCustomQuote: true,
      quoteReason: 'unlisted_route',
      fixedPrice: null,
      messageAr: UNLISTED_ROUTE_QUOTE_MESSAGE_AR,
    };
  }

  let priceForCategory: number | null = null;
  if (serviceCategory === 'sedan_comfort') {
    priceForCategory = typeof matchedRule.sedanPrice === 'number' && matchedRule.sedanPrice > 0
      ? matchedRule.sedanPrice
      : null;
  } else if (serviceCategory === 'suv_premium') {
    priceForCategory = typeof matchedRule.suvPrice === 'number' && matchedRule.suvPrice > 0
      ? matchedRule.suvPrice
      : null;
  } else if (serviceCategory === 'mini_van') {
    priceForCategory = typeof matchedRule.miniVanPrice === 'number' && matchedRule.miniVanPrice > 0
      ? matchedRule.miniVanPrice
      : null;
  }

  if (priceForCategory === null) {
    return {
      valid: true,
      requiresSpecialArrangement: false,
      requiresCustomQuote: true,
      quoteReason: serviceCategory === 'mini_van' ? 'minivan_unconfigured' : 'unlisted_route',
      fixedPrice: null,
      matchedRuleId: matchedRule.id,
      matchedRouteName: matchedRule.routeName,
      messageAr:
        serviceCategory === 'mini_van'
          ? 'فئة ميني فان غير مفعلة للتسعير التلقائي حالياً. يرجى التواصل معنا للحصول على عرض سعر خاص.'
          : UNLISTED_ROUTE_QUOTE_MESSAGE_AR,
    };
  }

  return {
    valid: true,
    requiresSpecialArrangement: false,
    requiresCustomQuote: false,
    fixedPrice: priceForCategory,
    matchedRuleId: matchedRule.id,
    matchedRouteName: matchedRule.routeName,
  };
}

export function buildWhatsAppBookingMessage(params: {
  customerName: string;
  customerPhone: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengersCount: number;
  luggageCount: number;
  serviceCategoryLabel: string;
  priceLabel: string;
  assignedVehicleModel?: string;
}): string {
  const lines = [
    'طلب حجز رحلة انتقال جديدة',
    '',
    `الاسم: ${params.customerName || 'غير محدد'}`,
    `رقم التواصل: ${params.customerPhone || 'غير محدد'}`,
    '',
    `من: ${params.origin || 'غير محدد'}`,
    `إلى: ${params.destination || 'غير محدد'}`,
    '',
    `التاريخ: ${params.date || 'غير محدد'}`,
    `الوقت: ${params.time || 'غير محدد'}`,
    '',
    `عدد الركاب: ${params.passengersCount}`,
    `عدد الحقائب: ${params.luggageCount}`,
    '',
    `فئة الخدمة: ${params.serviceCategoryLabel}`,
    '',
    `قيمة الرحلة: ${params.priceLabel}`,
  ];

  if (params.assignedVehicleModel) {
    lines.push('', `السيارة المخصصة: ${params.assignedVehicleModel}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppBookingUrl(params: Parameters<typeof buildWhatsAppBookingMessage>[0]): string {
  const message = buildWhatsAppBookingMessage(params);
  return `${OFFICIAL_WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

export function buildDailyRentalWhatsAppMessage(params: {
  customerName: string;
  customerPhone: string;
  pkg: DailyRentalPackage;
  usageDate: string;
  startTime: string;
  notes?: string;
}): string {
  const lines = [
    'طلب حجز خدمة التأجير اليومي داخل الإسكندرية',
    '',
    `الاسم: ${params.customerName || 'غير محدد'}`,
    `رقم التواصل: ${params.customerPhone || 'غير محدد'}`,
    '',
    `الباقة: ${params.pkg.titleEn} (${params.pkg.titleAr})`,
    `سعر الباقة: ${params.pkg.priceEgp.toLocaleString('en-US')} جنيه مصري`,
    `مدة الاستخدام: ${params.pkg.durationLabelAr}`,
    `المسافة المسموحة: ${params.pkg.distanceLabelAr}`,
    `نطاق الخدمة: ${params.pkg.scopeLabelAr}`,
    '',
    `تاريخ الاستخدام: ${params.usageDate || 'غير محدد'}`,
    `وقت البدء: ${params.startTime || 'غير محدد'}`,
  ];

  if (params.notes?.trim()) {
    lines.push('', `ملاحظات: ${params.notes.trim()}`);
  }

  return lines.join('\n');
}

export function buildDailyRentalWhatsAppUrl(
  params: Parameters<typeof buildDailyRentalWhatsAppMessage>[0]
): string {
  const message = buildDailyRentalWhatsAppMessage(params);
  return `${OFFICIAL_WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}
