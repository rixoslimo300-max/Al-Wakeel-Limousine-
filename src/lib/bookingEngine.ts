import { PricingRule, ServiceCategoryKey } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '+201000053774';
export const OFFICIAL_WHATSAPP_BASE_URL = 'https://wa.me/201000053774';
export const OFFICIAL_TEL_HREF = 'tel:+201000053774';

export const UNLISTED_ROUTE_QUOTE_MESSAGE_AR = 'يرجى التواصل معنا للحصول على عرض سعر خاص';

/**
 * Returns a date-input value in the user's local timezone.
 * Avoids UTC date shifts around midnight in regions ahead of UTC.
 */
export function getLocalDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
      'انتقال خاص للأفراد والرحلات الصغيرة حتى 3 ركاب وحقيبتين؛ مناسب لمشاوير الإسكندرية إلى المطارات عندما تريد سيارة مخصصة لك ولرفاقك.',
    legacyVehicleCategoryId: 'sedan-luxury',
    minPassengers: 1,
    maxPassengers: 3,
  },
  suv_premium: {
    key: 'suv_premium',
    code: 'PREMIUM',
    titleAr: 'بريميوم',
    titleEn: 'Premium',
    fullLabelAr: 'Premium — بريميوم',
    descriptionAr:
      'مساحة أوسع لرحلاتك الخاصة؛ تناسب حتى 4 ركاب مع 4 حقائب، أو 5–6 ركاب دون حقائب، وفق قواعد السعة المعتمدة.',
    legacyVehicleCategoryId: 'vip-suv',
    minPassengers: 1,
    maxPassengers: 6,
  },
  mini_van: {
    key: 'mini_van',
    code: 'MINI VAN',
    titleAr: 'ميني فان',
    titleEn: 'Mini Van',
    fullLabelAr: 'MINI VAN — ميني فان',
    descriptionAr:
      'فئة للمجموعات والحمولات الأكبر؛ يحددها النظام وفق عدد الركاب والحقائب معًا، لتجميع الرحلة في مركبة واحدة متى سمحت السعة المعتمدة.',
    legacyVehicleCategoryId: 'family-van',
    minPassengers: 1,
    maxPassengers: 10,
  },
  mini_van_premium: {
    key: 'mini_van_premium',
    code: 'PREMIUM MINI VAN',
    titleAr: 'ميني فان بريميوم',
    titleEn: 'Premium Mini Van',
    fullLabelAr: 'Premium Mini Van — ميني فان بريميوم',
    descriptionAr:
      'فئة ضيافة مستقلة بمقصورة أوسع، متاحة حتى 4 ركاب و5 حقائب كحد أقصى؛ ويُحدد سعرها بعد مراجعة تفاصيل الرحلة.',
    legacyVehicleCategoryId: 'premium-minivan',
    minPassengers: 1,
    maxPassengers: 4,
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

export const DAILY_RENTAL_HEADING_AR = 'يومك مليان مشاوير؟ اجمعها في باقة تأجير يومي داخل الإسكندرية';
export const DAILY_RENTAL_INTRO_AR =
  'بدل ما ترتب سيارة لكل مشوار، اجمع اجتماعاتك وتنقلاتك في باقة واحدة داخل الإسكندرية. اختر 8 أو 12 ساعة، وراجع السعر وحدود المسافة والاستخدام قبل إرسال الطلب.';

export const DAILY_RENTAL_PACKAGES: DailyRentalPackage[] = [
  {
    id: 'daily-rental-8h',
    titleEn: 'Daily Rental – 8 Hours',
    titleAr: '8 ساعات تجمع مشاوير يومك',
    priceEgp: 2800,
    maxHours: 8,
    maxKm: 120,
    durationLabelAr: 'حتى 8 ساعات',
    distanceLabelAr: 'حتى 120 كم',
    scopeLabelAr: 'داخل الإسكندرية',
    descriptionAr:
      'لو جدولك فيه أكثر من مشوار أو اجتماع، استخدم سيارة واحدة داخل الإسكندرية لمدة تصل إلى 8 ساعات ومسافة حتى 120 كم، بسعر الباقة المعلن قبل إرسال الطلب.',
  },
  {
    id: 'daily-rental-12h',
    titleEn: 'Daily Rental – 12 Hours',
    titleAr: '12 ساعة ليوم طويل من الالتزامات',
    priceEgp: 3600,
    maxHours: 12,
    maxKm: 150,
    durationLabelAr: 'حتى 12 ساعة',
    distanceLabelAr: 'حتى 150 كم',
    scopeLabelAr: 'داخل الإسكندرية',
    descriptionAr:
      'لما يكون يومك أطول ومشاويرك متعددة، تتيح لك الباقة استخدام السيارة حتى 12 ساعة ومسافة تصل إلى 150 كم داخل الإسكندرية، مع معرفة السعر وحدود الاستخدام قبل إرسال الطلب.',
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
    'Hyundai Elantra CN7 2027',
    'Toyota Corolla 2027',
    'Kia Grand Cerato 2027',
  ],
  suv_premium: [
    'Soueast S07 2027',
    'Kia Sportage 2027',
  ],
  mini_van: [
    'Mitsubishi Xpander 2027',
    'Toyota Hiace M55 2027',
  ],
  mini_van_premium: [
    'Kia Carnival 2027',
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

export const QUOTE_REVIEW_MESSAGE_AR = 'السعر بعد مراجعة تفاصيل الرحلة';

export const VEHICLE_ALLOCATION_DISCLAIMER_AR =
  'الصورة التمثيلية لا تمثل تعهدًا بتخصيص السيارة نفسها للعميل، بل تمثل الفئة المخصصة فقط، وتحتفظ الشركة بحق تخصيص السيارة الفعلية المتاحة من الفئة نفسها عند تأكيد الحجز وتنفيذ الرحلة.';

export type MatrixVehicleId = 'soueast-s07' | 'mitsubishi-xpander' | 'toyota-hiace-m55';
export type RepresentativeVehicleId = MatrixVehicleId | 'hyundai-elantra-cn7' | 'kia-carnival';

export interface VehicleAllocationResult {
  passengersCount: number;
  luggageCount: number;
  matchedRuleNumber: 1 | 2 | 3 | 4 | 5 | 6;
  matrixVehicleId: MatrixVehicleId;
  representativeVehicleId: RepresentativeVehicleId;
  representativeModelNameAr: string;
  representativeModelNameEn: string;
  representativeColorAr: 'أسود' | 'أبيض لؤلؤي' | 'فيراني (رمادي معدني)';
  effectiveCategory: ServiceCategoryKey;
  allowedCategories: ServiceCategoryKey[];
  sedanEligible: boolean;
  premiumMiniVanEligible: boolean;
  forcedMiniVan: boolean;
  forcedMiniVanByLuggage: boolean;
  forcedMiniVanByPassengers: boolean;
  exceedsStandardVehicles: boolean;
  requiresAdminVehicleReview: boolean;
  noticeAr: string | null;
  disclaimerAr: string;
}

const MATRIX_VEHICLE_META: Record<
  RepresentativeVehicleId,
  { nameAr: string; nameEn: string; colorAr: 'أسود' | 'أبيض لؤلؤي' | 'فيراني (رمادي معدني)' }
> = {
  'soueast-s07': { nameAr: 'سوايست S07 2027', nameEn: 'Soueast S07 2027', colorAr: 'أسود' },
  'mitsubishi-xpander': {
    nameAr: 'ميتسوبيشي إكسباندر 2027',
    nameEn: 'Mitsubishi Xpander 2027',
    colorAr: 'فيراني (رمادي معدني)',
  },
  'toyota-hiace-m55': {
    nameAr: 'تويوتا هاي إيس M55 2027',
    nameEn: 'Toyota Hiace M55 2027',
    colorAr: 'أبيض لؤلؤي',
  },
  'hyundai-elantra-cn7': {
    nameAr: 'سيدان مريحة 2027',
    nameEn: 'Comfort Sedan 2027',
    colorAr: 'فيراني (رمادي معدني)',
  },
  'kia-carnival': {
    nameAr: 'كيا كارنيفال 2027',
    nameEn: 'Kia Carnival 2027',
    colorAr: 'أسود',
  },
};

/**
 * Unified central vehicle allocation matrix (Strict Priority Order 1 -> 6)
 * plus independent Premium Mini Van (Kia Carnival 2027) hard-gated strictly at <= 4 pax AND <= 5 bags.
 */
export function allocateVehicleForTrip(params: {
  passengersCount: number;
  luggageCount: number;
  preferredCategory?: ServiceCategoryKey | null;
}): VehicleAllocationResult {
  const pax =
    Number.isInteger(params.passengersCount) && params.passengersCount >= 1
      ? params.passengersCount
      : 1;
  const bags =
    Number.isInteger(params.luggageCount) && params.luggageCount >= 0 ? params.luggageCount : 0;

  let matchedRuleNumber: 1 | 2 | 3 | 4 | 5 | 6;
  let matrixVehicleId: MatrixVehicleId;
  let matrixCategory: ServiceCategoryKey;

  // Strict Basic Priority Order (UNCHANGED):
  if (bags > 5) {
    // 1. luggageCount > 5 -> Toyota Hiace M55 (Pearl White)
    matchedRuleNumber = 1;
    matrixVehicleId = 'toyota-hiace-m55';
    matrixCategory = 'mini_van';
  } else if (pax > 4 && bags >= 1) {
    // 2. passengersCount > 4 && luggageCount >= 1 -> Toyota Hiace M55 (Pearl White)
    matchedRuleNumber = 2;
    matrixVehicleId = 'toyota-hiace-m55';
    matrixCategory = 'mini_van';
  } else if (pax > 6) {
    // 3. passengersCount > 6 -> Toyota Hiace M55 (Pearl White)
    matchedRuleNumber = 3;
    matrixVehicleId = 'toyota-hiace-m55';
    matrixCategory = 'mini_van';
  } else if (bags === 5 && pax <= 4) {
    // 4. luggageCount === 5 && passengersCount <= 4 -> Mitsubishi Xpander (Metallic Grey)
    matchedRuleNumber = 4;
    matrixVehicleId = 'mitsubishi-xpander';
    matrixCategory = 'mini_van';
  } else if (bags <= 4 && pax <= 4) {
    // 5. luggageCount <= 4 && passengersCount <= 4 -> Soueast S07 (Black)
    matchedRuleNumber = 5;
    matrixVehicleId = 'soueast-s07';
    matrixCategory = 'suv_premium';
  } else {
    // 6. passengersCount 5..6 && luggageCount === 0 -> Soueast S07 (Black)
    matchedRuleNumber = 6;
    matrixVehicleId = 'soueast-s07';
    matrixCategory = 'suv_premium';
  }

  // Comfort Sedan is eligible ONLY when 1..3 pax AND 0..2 bags.
  const sedanEligible = pax <= 3 && bags <= 2 && matrixCategory !== 'mini_van';

  // Premium Mini Van (Kia Carnival 2027) is an independent category strictly eligible ONLY when 1..4 pax AND 0..5 bags.
  // Any case with passengersCount >= 5 OR luggageCount >= 6 is strictly INELIGIBLE.
  const premiumMiniVanEligible = pax >= 1 && pax <= 4 && bags >= 0 && bags <= 5;

  const allowedCategories: ServiceCategoryKey[] = [matrixCategory];
  if (sedanEligible && !allowedCategories.includes('sedan_comfort')) {
    allowedCategories.push('sedan_comfort');
  }
  if (premiumMiniVanEligible && !allowedCategories.includes('mini_van_premium')) {
    allowedCategories.push('mini_van_premium');
  }

  // Apply preferred category only if capacity allows it; Carnival never replaces Xpander/Hiace/S07 automatically.
  let effectiveCategory: ServiceCategoryKey = matrixCategory;
  if (params.preferredCategory && allowedCategories.includes(params.preferredCategory)) {
    effectiveCategory = params.preferredCategory;
  } else if (!params.preferredCategory && sedanEligible) {
    effectiveCategory = 'sedan_comfort';
  }

  const representativeVehicleId: RepresentativeVehicleId =
    effectiveCategory === 'mini_van_premium'
      ? 'kia-carnival'
      : effectiveCategory === 'sedan_comfort'
        ? 'hyundai-elantra-cn7'
        : matrixVehicleId;

  const meta = MATRIX_VEHICLE_META[representativeVehicleId];

  const forcedMiniVan = matrixCategory === 'mini_van';
  const forcedMiniVanByLuggage = matchedRuleNumber === 1 || matchedRuleNumber === 4;
  const forcedMiniVanByPassengers = matchedRuleNumber === 2 || matchedRuleNumber === 3;
  const exceedsStandardVehicles = pax > 10;

  let noticeAr: string | null = null;
  if (params.preferredCategory === 'mini_van_premium' && !premiumMiniVanEligible) {
    if (pax > 4 && bags > 5) {
      noticeAr =
        'فئة ميني فان بريميوم متاحة لـ 1 إلى 4 ركاب و5 حقائب كحد أقصى؛ لتجاوز السعة المحددة تم التحويل تلقائيًا إلى Toyota Hiace M55.';
    } else if (pax > 4) {
      noticeAr =
        matchedRuleNumber === 6
          ? 'فئة ميني فان بريميوم غير متاحة عند 5 ركاب فأكثر (الحد الأقصى 4 ركاب)؛ تم التحويل تلقائيًا إلى Soueast S07 المناسبة.'
          : 'فئة ميني فان بريميوم غير متاحة عند 5 ركاب فأكثر (الحد الأقصى 4 ركاب)؛ تم التحويل تلقائيًا إلى Toyota Hiace M55 المناسبة.';
    } else {
      noticeAr =
        'فئة ميني فان بريميوم غير متاحة لأكثر من 5 حقائب؛ تم التحويل تلقائيًا إلى فئة ميني فان (Toyota Hiace M55).';
    }
  } else if (matchedRuleNumber === 1) {
    noticeAr =
      'لتجاوز عدد الحقائب 5 حقائب، تم تخصيص فئة ميني فان (Toyota Hiace M55) تلقائيًا لاستيعاب الأمتعة والركاب.';
  } else if (matchedRuleNumber === 2) {
    noticeAr =
      'لوجود أكثر من 4 ركاب مع حقائب، تم تخصيص فئة ميني فان (Toyota Hiace M55) تلقائيًا لضمان السعة المناسبة.';
  } else if (matchedRuleNumber === 3) {
    noticeAr = exceedsStandardVehicles
      ? 'لتجاوز 6 ركاب، تم تخصيص فئة ميني فان (Toyota Hiace M55) وسيتم مراجعة ترتيبات المجموعة مع الإدارة.'
      : 'لوجود 7 إلى 10 ركاب، تم تخصيص فئة ميني فان (Toyota Hiace M55) تلقائيًا.';
  } else if (matchedRuleNumber === 4 && effectiveCategory !== 'mini_van_premium') {
    noticeAr =
      'لوجود 5 حقائب مع حتى 4 ركاب، تم تخصيص فئة ميني فان (Mitsubishi Xpander) تلقائيًا، ويمكنك اختيار «ميني فان بريميوم» المستقلة عند الرغبة.';
  } else if (params.preferredCategory === 'sedan_comfort' && !sedanEligible) {
    noticeAr =
      'نظرًا لعدد الركاب أو الحقائب، تم التحديث تلقائيًا إلى فئة بريميوم (Soueast S07) المناسبة للسعة.';
  }

  return {
    passengersCount: pax,
    luggageCount: bags,
    matchedRuleNumber,
    matrixVehicleId,
    representativeVehicleId,
    representativeModelNameAr: meta.nameAr,
    representativeModelNameEn: meta.nameEn,
    representativeColorAr: meta.colorAr,
    effectiveCategory,
    allowedCategories,
    sedanEligible,
    premiumMiniVanEligible,
    forcedMiniVan,
    forcedMiniVanByLuggage,
    forcedMiniVanByPassengers,
    exceedsStandardVehicles,
    requiresAdminVehicleReview:
      effectiveCategory === 'mini_van' ||
      effectiveCategory === 'mini_van_premium' ||
      exceedsStandardVehicles,
    noticeAr,
    disclaimerAr: VEHICLE_ALLOCATION_DISCLAIMER_AR,
  };
}

/**
 * Calculates the representative vehicle and allowed service categories using the unified priority matrix:
 * 1. luggageCount > 5 -> Toyota Hiace M55
 * 2. passengersCount > 4 && luggageCount >= 1 -> Toyota Hiace M55
 * 3. passengersCount > 6 -> Toyota Hiace M55
 * 4. luggageCount === 5 && passengersCount <= 4 -> Mitsubishi Xpander (or Kia Carnival when mini_van_premium is selected)
 * 5. luggageCount <= 4 && passengersCount <= 4 -> Soueast S07 (sedan_comfort eligible up to 3 pax & 2 bags; Kia Carnival eligible up to 4 pax & 5 bags)
 * 6. passengersCount 5..6 && luggageCount === 0 -> Soueast S07 (Kia Carnival strictly ineligible)
 */
export function calculateRepresentativeVehicle(params: {
  passengersCount: number;
  luggageCount: number;
  preferredCategory?: ServiceCategoryKey | null;
}): VehicleAllocationResult;
export function calculateRepresentativeVehicle(
  passengersCount: number,
  luggageCount: number,
  preferredCategory?: ServiceCategoryKey | null
): VehicleAllocationResult;
export function calculateRepresentativeVehicle(
  paramsOrPassengers:
    | {
        passengersCount: number;
        luggageCount: number;
        preferredCategory?: ServiceCategoryKey | null;
      }
    | number,
  luggageCountArg?: number,
  preferredCategoryArg?: ServiceCategoryKey | null
): VehicleAllocationResult {
  if (typeof paramsOrPassengers === 'number') {
    return allocateVehicleForTrip({
      passengersCount: paramsOrPassengers,
      luggageCount: luggageCountArg ?? 0,
      preferredCategory: preferredCategoryArg ?? null,
    });
  }
  return allocateVehicleForTrip(paramsOrPassengers);
}

export interface CapacityEvaluationResult {
  allowedCategories: ServiceCategoryKey[];
  effectiveCategory: ServiceCategoryKey;
  allocation: VehicleAllocationResult;
  forcedMiniVanByLuggage: boolean;
  forcedMiniVanByPassengers: boolean;
  exceedsMaxCapacity: boolean;
  requiresAdminVehicleReview: boolean;
  noticeAr: string | null;
  categorySpecs: Record<
    ServiceCategoryKey,
    {
      allowed: boolean;
      disabledReasonAr: string | null;
      maxPassengers: number;
      maxLuggage: number;
    }
  >;
}

export function getAllowedCategoriesForPassengers(
  passengersCount: number,
  luggageCount: number = 0
): ServiceCategoryKey[] {
  if (!Number.isInteger(passengersCount) || passengersCount < 1) {
    return [];
  }
  const bags = Number.isInteger(luggageCount) && luggageCount >= 0 ? luggageCount : 0;
  return allocateVehicleForTrip({ passengersCount, luggageCount: bags }).allowedCategories;
}

export function getDefaultCategoryForPassengers(
  passengersCount: number,
  luggageCount: number = 0
): ServiceCategoryKey | null {
  if (!Number.isInteger(passengersCount) || passengersCount < 1) {
    return null;
  }
  const bags = Number.isInteger(luggageCount) && luggageCount >= 0 ? luggageCount : 0;
  return allocateVehicleForTrip({ passengersCount, luggageCount: bags }).effectiveCategory;
}

export function evaluateVehicleCapacity(params: {
  passengersCount: number;
  luggageCount: number;
  preferredCategory?: ServiceCategoryKey | null;
}): CapacityEvaluationResult {
  const allocation = allocateVehicleForTrip(params);
  const pax = allocation.passengersCount;
  const bags = allocation.luggageCount;

  const sedanDisabledReason = allocation.forcedMiniVan
    ? 'غير متاحة لهذه السعة؛ تم تخصيص فئة ميني فان المناسبة تلقائيًا.'
    : pax > 3
      ? 'سعة السيدان المريحة لا تتجاوز 3 ركاب.'
      : bags > 2
        ? 'سعة السيدان المريحة لا تتجاوز حقيبتين.'
        : null;

  const suvDisabledReason = allocation.forcedMiniVan
    ? 'فئة SUV غير متاحة لهذه السعة؛ تم تخصيص فئة ميني فان المناسبة تلقائيًا.'
    : null;

  const miniVanDisabledReason =
    allocation.allowedCategories.includes('mini_van')
      ? null
      : 'تظهر تلقائيًا فقط عند تجاوز سعة السيدان وSUV.';

  const miniVanPremiumDisabledReason =
    allocation.allowedCategories.includes('mini_van_premium')
      ? null
      : pax > 4
        ? 'الحد الأقصى لفئة ميني فان بريميوم هو 4 ركاب فقط.'
        : 'الحد الأقصى لفئة ميني فان بريميوم هو 5 حقائب فقط.';

  return {
    allowedCategories: allocation.allowedCategories,
    effectiveCategory: allocation.effectiveCategory,
    allocation,
    forcedMiniVanByLuggage: allocation.forcedMiniVanByLuggage,
    forcedMiniVanByPassengers: allocation.forcedMiniVanByPassengers,
    exceedsMaxCapacity: allocation.exceedsStandardVehicles,
    requiresAdminVehicleReview: allocation.requiresAdminVehicleReview,
    noticeAr: allocation.noticeAr,
    categorySpecs: {
      sedan_comfort: {
        allowed: allocation.allowedCategories.includes('sedan_comfort'),
        disabledReasonAr: sedanDisabledReason,
        maxPassengers: 3,
        maxLuggage: 2,
      },
      suv_premium: {
        allowed: allocation.allowedCategories.includes('suv_premium'),
        disabledReasonAr: suvDisabledReason,
        maxPassengers: 6,
        maxLuggage: 4,
      },
      mini_van: {
        allowed: allocation.allowedCategories.includes('mini_van'),
        disabledReasonAr: miniVanDisabledReason,
        maxPassengers: 10,
        maxLuggage: 7,
      },
      mini_van_premium: {
        allowed: allocation.allowedCategories.includes('mini_van_premium'),
        disabledReasonAr: miniVanPremiumDisabledReason,
        maxPassengers: 4,
        maxLuggage: 5,
      },
    },
  };
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
  quoteReason?:
    | 'minivan_unconfigured'
    | 'minivan_premium_unconfigured'
    | 'unlisted_route'
    | 'invalid_passengers'
    | 'same_location'
    | 'category_mismatch'
    | 'missing_route';
  fixedPrice: number | null;
  matchedRuleId?: string;
  matchedRouteName?: string;
  messageAr?: string;
}

export function calculateTripQuote(params: {
  origin: string;
  destination: string;
  passengersCount: number;
  luggageCount?: number;
  serviceCategory: ServiceCategoryKey | null;
  pricingRules: PricingRule[];
}): TripQuoteResult {
  const {
    origin,
    destination,
    passengersCount,
    luggageCount = 0,
    serviceCategory,
    pricingRules,
  } = params;

  const bags = Number.isInteger(luggageCount) && luggageCount >= 0 ? luggageCount : 0;

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

  const allocation = allocateVehicleForTrip({
    passengersCount,
    luggageCount: bags,
    preferredCategory: serviceCategory,
  });

  if (allocation.exceedsStandardVehicles) {
    return {
      valid: true,
      requiresSpecialArrangement: true,
      requiresCustomQuote: true,
      quoteReason: 'invalid_passengers',
      fixedPrice: null,
      messageAr: QUOTE_REVIEW_MESSAGE_AR,
    };
  }

  const originKey = normalizeLocationKey(origin);
  const destKey = normalizeLocationKey(destination);

  if (!originKey || !destKey) {
    return {
      valid: false,
      requiresSpecialArrangement: false,
      requiresCustomQuote: true,
      quoteReason: 'missing_route',
      fixedPrice: null,
      messageAr: QUOTE_REVIEW_MESSAGE_AR,
    };
  }

  if (originKey === destKey) {
    return {
      valid: false,
      requiresSpecialArrangement: false,
      requiresCustomQuote: false,
      quoteReason: 'same_location',
      fixedPrice: null,
      messageAr: 'لا يمكن أن تكون نقطة التحرك والوجهة متطابقتين.',
    };
  }

  const resolvedCategory = serviceCategory ?? allocation.effectiveCategory;
  if (!allocation.allowedCategories.includes(resolvedCategory)) {
    return {
      valid: false,
      requiresSpecialArrangement: false,
      requiresCustomQuote: false,
      quoteReason: 'category_mismatch',
      fixedPrice: null,
      messageAr:
        allocation.noticeAr || 'يرجى اعتماد فئة الخدمة المتوافقة مع عدد الركاب والأمتعة.',
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
      messageAr: QUOTE_REVIEW_MESSAGE_AR,
    };
  }

  let priceForCategory: number | null = null;
  if (resolvedCategory === 'sedan_comfort') {
    priceForCategory =
      typeof matchedRule.sedanPrice === 'number' && matchedRule.sedanPrice > 0
        ? matchedRule.sedanPrice
        : null;
  } else if (resolvedCategory === 'suv_premium') {
    priceForCategory =
      typeof matchedRule.suvPrice === 'number' && matchedRule.suvPrice > 0
        ? matchedRule.suvPrice
        : null;
  } else if (resolvedCategory === 'mini_van') {
    priceForCategory =
      typeof matchedRule.miniVanPrice === 'number' && matchedRule.miniVanPrice > 0
        ? matchedRule.miniVanPrice
        : null;
  } else if (resolvedCategory === 'mini_van_premium') {
    priceForCategory =
      typeof matchedRule.miniVanPremiumPrice === 'number' && matchedRule.miniVanPremiumPrice > 0
        ? matchedRule.miniVanPremiumPrice
        : null;
  }

  if (priceForCategory === null) {
    return {
      valid: true,
      requiresSpecialArrangement: false,
      requiresCustomQuote: true,
      quoteReason:
        resolvedCategory === 'mini_van_premium'
          ? 'minivan_premium_unconfigured'
          : resolvedCategory === 'mini_van'
            ? 'minivan_unconfigured'
            : 'unlisted_route',
      fixedPrice: null,
      matchedRuleId: matchedRule.id,
      matchedRouteName: matchedRule.routeName,
      messageAr: QUOTE_REVIEW_MESSAGE_AR,
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
