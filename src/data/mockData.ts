import { Service, Vehicle, PricingRule } from '../types';
import { OFFICIAL_ROUTE_PRICING, DAILY_RENTAL_PACKAGES } from '../lib/bookingEngine';

export const initialServices: Service[] = [
  {
    id: 'borg-el-arab-airport',
    titleAr: 'الانتقال من وإلى مطار برج العرب الدولي',
    titleEn: 'Borg El Arab Airport Transfers',
    descriptionAr: 'خدمة انتقال خاصة من نقطة إلى نقطة بين الإسكندرية ومطار برج العرب الدولي بأسعار ثابتة وواضحة.',
    descriptionEn: 'Private point-to-point pickup and drop-off service between Alexandria and Borg El Arab International Airport.',
    category: 'airport',
    basePrice: 850,
    imageUrl: '',
    popular: true
  },
  {
    id: 'cairo-airport',
    titleAr: 'انتقالات مطار القاهرة الدولي',
    titleEn: 'Cairo International Airport Transfers',
    descriptionAr: 'خدمة انتقال مباشرة بالاتجاهين بين الإسكندرية ومطار القاهرة الدولي بخصوصية كاملة وأسعار ثابتة.',
    descriptionEn: 'Direct private transfers between Alexandria and Cairo International Airport.',
    category: 'airport',
    basePrice: 1850,
    imageUrl: '',
    popular: true
  },
  {
    id: 'sphinx-airport',
    titleAr: 'انتقالات مطار سفنكس الدولي',
    titleEn: 'Sphinx International Airport Transfers',
    descriptionAr: 'رحلات مباشرة ومنظمة بالاتجاهين بين الإسكندرية ومطار سفنكس الدولي بأسعار ثابتة وواضحة.',
    descriptionEn: 'Organized direct transfers between Alexandria and Sphinx International Airport with fixed fares.',
    category: 'airport',
    basePrice: 1850,
    imageUrl: '',
    popular: true
  },
  {
    id: 'daily-rental-8h',
    titleAr: DAILY_RENTAL_PACKAGES[0].titleAr,
    titleEn: DAILY_RENTAL_PACKAGES[0].titleEn,
    descriptionAr: DAILY_RENTAL_PACKAGES[0].descriptionAr,
    descriptionEn: 'Daily private car rental inside Alexandria for up to 8 hours / 120 km.',
    category: 'daily_rental',
    basePrice: DAILY_RENTAL_PACKAGES[0].priceEgp,
    imageUrl: '',
    popular: true
  },
  {
    id: 'daily-rental-12h',
    titleAr: DAILY_RENTAL_PACKAGES[1].titleAr,
    titleEn: DAILY_RENTAL_PACKAGES[1].titleEn,
    descriptionAr: DAILY_RENTAL_PACKAGES[1].descriptionAr,
    descriptionEn: 'Daily private car rental inside Alexandria for up to 12 hours / 150 km.',
    category: 'daily_rental',
    basePrice: DAILY_RENTAL_PACKAGES[1].priceEgp,
    imageUrl: '',
    popular: true
  },
  {
    id: 'north-coast',
    titleAr: 'رحلات الساحل الشمالي والمدن الأخرى',
    titleEn: 'North Coast & Custom Intercity Trips',
    descriptionAr: 'تنقلات خاصة إلى الساحل الشمالي ومارينا والعلمين والمحافظات وفق عرض سعر خاص لكل مسار.',
    descriptionEn: 'Private transfers to North Coast, Marina, New Alamein, and other governorates with custom trip quotation.',
    category: 'tourism',
    basePrice: 0,
    imageUrl: '',
    popular: false
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'sedan-luxury',
    nameAr: 'سيدان مريحة (Comfort Sedan)',
    nameEn: 'Comfort Sedan',
    category: 'sedan',
    passengers: 3,
    luggage: 2,
    descriptionAr: 'تجربة انتقال خاصة تجمع بين الراحة والعملية، مع خصوصية كاملة طوال الرحلة، لتصل إلى وجهتك بسهولة وهدوء.',
    descriptionEn: 'Comfortable practical sedan service for up to 3 passengers.',
    imageUrl: '',
    features: ['تكييف هواء ممتاز', 'صالون مريح وهادئ', 'ثبات على الطرق السريعة', 'حتى 3 ركاب']
  },
  {
    id: 'vip-suv',
    nameAr: 'SUV بريميوم (Premium SUV)',
    nameEn: 'Premium SUV',
    category: 'suv',
    passengers: 6,
    luggage: 4,
    descriptionAr: 'ارتقِ بتجربة انتقالك مع سيارة SUV خاصة (Soueast S07 / Kia Sportage 2027) مناسبة لـ 1–4 ركاب بالأمتعة أو 5–6 ركاب بدون حقائب.',
    descriptionEn: 'Elevated SUV executive comfort (Soueast S07 / Kia Sportage 2027) for up to 4 passengers with luggage or 5-6 without luggage.',
    imageUrl: '',
    features: ['رحابة أكبر للأمتعة', 'تحكم مناخي مستقل', 'عزل صوتي متطور', 'حتى 4 حقائب']
  },
  {
    id: 'premium-minivan',
    nameAr: 'ميني فان بريميوم (Premium Mini Van)',
    nameEn: 'Premium Mini Van',
    category: 'van',
    passengers: 4,
    luggage: 5,
    descriptionAr: 'فئة ميني فان بريميوم مستقلة فاخرة (Kia Carnival 2027) متاحة عند الطلب حتى 4 ركاب و5 حقائب كحد أقصى.',
    descriptionEn: 'Independent Luxury Premium Mini Van (Kia Carnival 2027) available on request for up to 4 passengers and 5 bags.',
    imageUrl: '',
    features: ['1–4 ركاب كحد أقصى', 'حتى 5 حقائب كحد أقصى', 'فئة مستقلة فاخرة', 'السعر بعد المراجعة']
  },
  {
    id: 'family-van',
    nameAr: 'ميني فان (Mini Van)',
    nameEn: 'Mini Van',
    category: 'van',
    passengers: 10,
    luggage: 7,
    descriptionAr: 'فئة عائلية وجماعية رحبة تُخصَّص تلقائيًا عند وجود 5 حقائب فأكثر أو أكثر من 4 ركاب مع أمتعة أو 7–10 ركاب.',
    descriptionEn: 'Dedicated group and luggage capacity (Mitsubishi Xpander 2027 / Toyota Hiace M55 2027) for up to 10 passengers.',
    imageUrl: '',
    features: ['حتى 10 ركاب', 'مساحة كبيرة للأمتعة', 'تكييف خلفي مستقل', 'تخصيص تلقائي']
  }
];

export const initialPricingRules: PricingRule[] = OFFICIAL_ROUTE_PRICING;
