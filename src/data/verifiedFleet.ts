import soueastS07Img from '../assets/images/fleet_soueast_s07_clean_1795717054551.jpg';
import xpanderGrayImg from '../assets/images/fleet_xpander_2026_gray_1795707505790.jpg';
import jetourX70Img from '../assets/images/fleet_jetour_x70_black_1795707505343.jpg';
import tucsonImg from '../assets/images/fleet_tucson_2026_rep_1795707505957.jpg';
import sportageImg from '../assets/images/fleet_sportage_2026_rep_1795707506964.jpg';
import elantraImg from '../assets/images/fleet_elantra_cn7_rep_1795707507931.jpg';
import corollaImg from '../assets/images/fleet_corolla_rep_1795707507843.jpg';
import ceratoImg from '../assets/images/fleet_cerato_rep_1795707508289.jpg';

export type FleetGroupKey = 'suv-family' | 'sedan';

export interface VerifiedFleetModel {
  id: string;
  bookingVehicleCategoryId: 'vip-suv' | 'sedan-luxury';
  group: FleetGroupKey;
  nameAr: string;
  nameEn: string;
  passengers: number;
  luggage: number;
  colorConfirmed: boolean;
  colorLabelAr: string;
  colorLabelEn: string;
  colorSwatchHex?: string;
  descriptionAr: string;
  features: string[];
  imageUrl: string;
}

export const VERIFIED_FLEET_MODELS: VerifiedFleetModel[] = [
  // SUV & Family Vehicles
  {
    id: 'soueast-s07',
    bookingVehicleCategoryId: 'vip-suv',
    group: 'suv-family',
    nameAr: 'سوايست S07',
    nameEn: 'Soueast S07',
    passengers: 6,
    luggage: 4,
    colorConfirmed: true,
    colorLabelAr: 'أسود',
    colorLabelEn: 'Black',
    colorSwatchHex: '#111317',
    descriptionAr: 'مركبة SUV عائلية رحبة مناسبة لانتقالات المطارات والساحل الشمالي والرحلات الطويلة.',
    features: ['مقاعد عائلية مريحة', 'تكييف ثنائي المناطق', 'مساحة أمتعة مرنة', 'عزل صوتي هادئ'],
    imageUrl: soueastS07Img,
  },
  {
    id: 'mitsubishi-xpander-2026',
    bookingVehicleCategoryId: 'vip-suv',
    group: 'suv-family',
    nameAr: 'ميتسوبيشي إكسباندر 2026',
    nameEn: 'Mitsubishi Xpander 2026',
    passengers: 6,
    luggage: 4,
    colorConfirmed: true,
    colorLabelAr: 'رمادي ميتاليك (فيراني)',
    colorLabelEn: 'Metallic Gray',
    colorSwatchHex: '#596069',
    descriptionAr: 'سيارة عائلية عملية ذات 7 مقاعد مصممة لراحة العائلات والمجموعات في المسافات الطويلة.',
    features: ['تكييف خلفي مستقل', 'انسيابية في الطرق السريعة', 'مساحة أقدام واسعة', 'منافذ شحن متعددة'],
    imageUrl: xpanderGrayImg,
  },
  {
    id: 'jetour-x70',
    bookingVehicleCategoryId: 'vip-suv',
    group: 'suv-family',
    nameAr: 'جيتور X70',
    nameEn: 'Jetour X70',
    passengers: 6,
    luggage: 4,
    colorConfirmed: true,
    colorLabelAr: 'أسود',
    colorLabelEn: 'Black',
    colorSwatchHex: '#111317',
    descriptionAr: 'سيارة دفع رباعي عائلية بمقصورة فسيحة ومجهزة لتنقلات المجموعات والرحلات بين المحافظات.',
    features: ['مقصورة عائلية فسيحة', 'صالون جلدي مريح', 'تكييف مركزي قوي', 'سعة تخزين مناسبة'],
    imageUrl: jetourX70Img,
  },
  {
    id: 'hyundai-tucson-2026',
    bookingVehicleCategoryId: 'vip-suv',
    group: 'suv-family',
    nameAr: 'هيونداي توسان 2026',
    nameEn: 'Hyundai Tucson 2026',
    passengers: 4,
    luggage: 4,
    colorConfirmed: false,
    colorLabelAr: 'صورة تمثيلية — اللون يُؤكد عند التنسيق',
    colorLabelEn: 'Illustrative image — color confirmed upon booking',
    descriptionAr: 'SUV عصرية تجمع بين الثبات على الطرق السريعة والراحة العالية في رحلات الأعمال والمطارات.',
    features: ['ثبات عالٍ على السفر', 'تحكم مناخي متطور', 'مقصورة هادئة', 'أنظمة أمان حديثة'],
    imageUrl: tucsonImg,
  },
  {
    id: 'kia-sportage-2026',
    bookingVehicleCategoryId: 'vip-suv',
    group: 'suv-family',
    nameAr: 'كيا سبورتاج 2026',
    nameEn: 'Kia Sportage 2026',
    passengers: 4,
    luggage: 4,
    colorConfirmed: false,
    colorLabelAr: 'صورة تمثيلية — اللون يُؤكد عند التنسيق',
    colorLabelEn: 'Illustrative image — color confirmed upon booking',
    descriptionAr: 'تصميم تنفيذي حديث وقيادة سلسة لرحلات الإسكندرية والقاهرة والساحل الشمالي.',
    features: ['مقاعد مريحة للسفر', 'عزل ممتاز للضوضاء', 'تكييف خلفي', 'مساحة أمتعة رحبة'],
    imageUrl: sportageImg,
  },

  // Executive Sedans
  {
    id: 'hyundai-elantra-cn7',
    bookingVehicleCategoryId: 'sedan-luxury',
    group: 'sedan',
    nameAr: 'هيونداي إلنترا CN7',
    nameEn: 'Hyundai Elantra CN7',
    passengers: 3,
    luggage: 2,
    colorConfirmed: false,
    colorLabelAr: 'صورة تمثيلية — اللون تحت التأكيد',
    colorLabelEn: 'Representative image — color pending confirmation',
    descriptionAr: 'سيدان حديثة بانسيابية عالية مناسبة لاجتماعات العمل وانتقالات المطار الفردية.',
    features: ['مقصورة مريحة وهادئة', 'تكييف أوتوماتيكي', 'ثبات ممتاز بالسفر', 'منافذ شحن USB'],
    imageUrl: elantraImg,
  },
  {
    id: 'toyota-corolla',
    bookingVehicleCategoryId: 'sedan-luxury',
    group: 'sedan',
    nameAr: 'تويوتا كورولا',
    nameEn: 'Toyota Corolla',
    passengers: 3,
    luggage: 2,
    colorConfirmed: false,
    colorLabelAr: 'صورة تمثيلية — اللون تحت التأكيد',
    colorLabelEn: 'Representative image — color pending confirmation',
    descriptionAr: 'سيدان اعتمادية ومريحة للتنقلات اليومية وخطوط الإسكندرية والقاهرة.',
    features: ['اعتمادية عالية في السفر', 'تعليق مريح للطرق', 'تكييف هواء قوي', 'مساحة خلفية مريحة'],
    imageUrl: corollaImg,
  },
  {
    id: 'kia-grand-cerato',
    bookingVehicleCategoryId: 'sedan-luxury',
    group: 'sedan',
    nameAr: 'كيا جراند سيراتو',
    nameEn: 'Kia Grand Cerato',
    passengers: 3,
    luggage: 2,
    colorConfirmed: false,
    colorLabelAr: 'صورة تمثيلية — اللون تحت التأكيد',
    colorLabelEn: 'Representative image — color pending confirmation',
    descriptionAr: 'سيدان أنيقة وعملية مصممة لتنقلات المدينة واستقبال المطار بأعلى انضباط.',
    features: ['صالون داخلي أنيق', 'سلاسة في القيادة', 'تكييف خلفي مريح', 'صندوق أمتعة مناسب'],
    imageUrl: ceratoImg,
  },
];
