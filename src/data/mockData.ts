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
    passengers: 3,
    luggage: 4,
    descriptionAr: 'ارتقِ بتجربة انتقالك مع سيارة SUV خاصة توفر مساحة أرحب وراحة أكبر وخصوصية كاملة، لتصل إلى وجهتك بتجربة أكثر تميزًا.',
    descriptionEn: 'Elevated SUV executive comfort for up to 3 passengers.',
    imageUrl: '',
    features: ['رحابة أكبر للأمتعة', 'تحكم مناخي مستقل', 'عزل صوتي متطور', 'حتى 3 ركاب']
  },
  {
    id: 'family-van',
    nameAr: 'ميني فان (Mini Van)',
    nameEn: 'Mini Van',
    category: 'van',
    passengers: 5,
    luggage: 5,
    descriptionAr: 'مساحة مناسبة للرحلات التي تضم من 4 إلى 5 ركاب، مع توفير السيارة المناسبة لاحتياجات المجموعة.',
    descriptionEn: 'Dedicated space for groups of 4 to 5 passengers.',
    imageUrl: '',
    features: ['مخصصة لـ 4–5 ركاب', 'مساحة واسعة للأمتعة', 'تكييف خلفي مستقل', 'تنسيق خاص']
  }
];

export const initialPricingRules: PricingRule[] = OFFICIAL_ROUTE_PRICING;
