import soueastS07Img from '../assets/images/fleet_soueast_s07.webp';
import kiaSportageImg from '../assets/images/fleet_kia_sportage_2027.webp';
import kiaCarnivalImg from '../assets/images/fleet_kia_carnival_2027.webp';
import xpanderGray2027Img from '../assets/images/fleet_mitsubishi_xpander_2027.webp';
import hiaceM55WhiteImg from '../assets/images/fleet_toyota_hiace_m55.webp';
import elantraGrey2027Img from '../assets/images/fleet_elantra_cn7.webp';
import corollaGrey2027Img from '../assets/images/fleet_toyota_corolla.webp';

export type FleetGroupKey = 'suv-family' | 'mini-van-premium' | 'mini-van' | 'sedan';

export interface VerifiedFleetModel {
  id:
    | 'soueast-s07'
    | 'kia-sportage'
    | 'kia-carnival'
    | 'mitsubishi-xpander'
    | 'toyota-hiace-m55'
    | 'hyundai-elantra-cn7'
    | 'toyota-corolla'
    | 'kia-grand-cerato';
  modelYear: 2027;
  bookingVehicleCategoryId: 'vip-suv' | 'premium-minivan' | 'family-van' | 'sedan-luxury';
  group: FleetGroupKey;
  nameAr: string;
  nameEn: string;
  passengers: number;
  luggage: number;
  colorConfirmed: boolean;
  colorLabelAr: 'أسود' | 'أبيض لؤلؤي' | 'فيراني (رمادي معدني)';
  colorLabelEn: 'Black' | 'Pearl White' | 'Metallic Grey';
  colorSwatchHex: string;
  descriptionAr: string;
  features: string[];
  imageUrl: string;
  imageUnavailableReasonAr?: string;
}

export const REPRESENTATIVE_IMAGES_BY_MODEL_ID: Record<
  'soueast-s07' | 'kia-sportage' | 'kia-carnival' | 'mitsubishi-xpander' | 'toyota-hiace-m55' | 'hyundai-elantra-cn7' | 'toyota-corolla',
  string
> = {
  'soueast-s07': soueastS07Img,
  'kia-sportage': kiaSportageImg,
  'kia-carnival': kiaCarnivalImg,
  'mitsubishi-xpander': xpanderGray2027Img,
  'toyota-hiace-m55': hiaceM55WhiteImg,
  'hyundai-elantra-cn7': elantraGrey2027Img,
  'toyota-corolla': corollaGrey2027Img,
} as const;

export const VERIFIED_FLEET_MODELS: VerifiedFleetModel[] = [
  {
    id: 'soueast-s07',
    modelYear: 2027,
    bookingVehicleCategoryId: 'vip-suv',
    group: 'suv-family',
    nameAr: 'سوايست S07 2027',
    nameEn: 'Soueast S07 2027',
    passengers: 6,
    luggage: 4,
    colorConfirmed: true,
    colorLabelAr: 'أسود',
    colorLabelEn: 'Black',
    colorSwatchHex: '#111317',
    descriptionAr:
      'السيارة الرئيسية لفئة بريميوم SUV موديل 2027 باللون الأسود الفاخر؛ مناسبة لـ 1–4 ركاب مع حتى 4 حقائب أو 5–6 ركاب بدون أمتعة.',
    features: ['حتى 4 ركاب مع 4 حقائب', '5–6 ركاب بدون حقائب', 'مقصورة فسيحة هادئة', 'تكييف ثنائي المناطق'],
    imageUrl: soueastS07Img,
  },
  {
    id: 'kia-sportage',
    modelYear: 2027,
    bookingVehicleCategoryId: 'vip-suv',
    group: 'suv-family',
    nameAr: 'كيا سبورتاج 2027',
    nameEn: 'Kia Sportage 2027',
    passengers: 4,
    luggage: 4,
    colorConfirmed: true,
    colorLabelAr: 'أسود',
    colorLabelEn: 'Black',
    colorSwatchHex: '#111317',
    descriptionAr:
      'سيارة SUV رياضية فاخرة بتحديث 2027 وباللون الأسود المعتمد ضمن أسطول الشركة، تُخصَّص تشغيليًا وفق متطلبات الرحلة.',
    features: ['تصميم 2027 المحدث', 'حتى 4 ركاب و4 حقائب', 'عزل صوتي متطور', 'إضاءة LED نهارية'],
    imageUrl: kiaSportageImg,
  },
  {
    id: 'kia-carnival',
    modelYear: 2027,
    bookingVehicleCategoryId: 'premium-minivan',
    group: 'mini-van-premium',
    nameAr: 'كيا كارنيفال 2027',
    nameEn: 'Kia Carnival 2027',
    passengers: 4,
    luggage: 5,
    colorConfirmed: true,
    colorLabelAr: 'أسود',
    colorLabelEn: 'Black',
    colorSwatchHex: '#111317',
    descriptionAr:
      'فئة «ميني فان بريميوم» المستقلة موديل 2027 باللون الأسود الفاخر، متاحة حصريًا للرحلات حتى 4 ركاب و5 حقائب كحد أقصى.',
    features: ['1–4 ركاب بحد أقصى', 'حتى 5 حقائب كحد أقصى', 'أبواب منزلقة فاخرة', 'سعر بعد مراجعة الرحلة'],
    imageUrl: kiaCarnivalImg,
  },
  {
    id: 'mitsubishi-xpander',
    modelYear: 2027,
    bookingVehicleCategoryId: 'family-van',
    group: 'mini-van',
    nameAr: 'ميتسوبيشي إكسباندر 2027',
    nameEn: 'Mitsubishi Xpander 2027',
    passengers: 4,
    luggage: 5,
    colorConfirmed: true,
    colorLabelAr: 'فيراني (رمادي معدني)',
    colorLabelEn: 'Metallic Grey',
    colorSwatchHex: '#596069',
    descriptionAr:
      'مركبة عائلية حديثة موديل 2027 باللون الفيراني (رمادي معدني)، مخصصة تلقائيًا للرحلات التي تضم حتى 4 ركاب مع 5 حقائب.',
    features: ['حتى 4 ركاب', 'تستوعب 5 حقائب', 'تكييف خلفي مستقل', 'منافذ شحن متعددة'],
    imageUrl: xpanderGray2027Img,
  },
  {
    id: 'toyota-hiace-m55',
    modelYear: 2027,
    bookingVehicleCategoryId: 'family-van',
    group: 'mini-van',
    nameAr: 'تويوتا هاي إيس M55 2027',
    nameEn: 'Toyota Hiace M55 2027',
    passengers: 10,
    luggage: 7,
    colorConfirmed: true,
    colorLabelAr: 'أبيض لؤلؤي',
    colorLabelEn: 'Pearl White',
    colorSwatchHex: '#F4F5F7',
    descriptionAr:
      'ميني فان تنفيذية فسيحة موديل 2027 باللون الأبيض اللؤلؤي المعتمد، مخصصة للمجموعات (7–10 ركاب) أو أكثر من 4 ركاب مع حقائب أو أكثر من 5 حقائب.',
    features: ['سعة حتى 10 ركاب', 'مساحة أمتعة كبيرة (+6 حقائب)', 'تكييف مركزي قوي', 'مقاعد سياحية مريحة'],
    imageUrl: hiaceM55WhiteImg,
  },
  {
    id: 'hyundai-elantra-cn7',
    modelYear: 2027,
    bookingVehicleCategoryId: 'sedan-luxury',
    group: 'sedan',
    nameAr: 'هيونداي إلنترا CN7 2027',
    nameEn: 'Hyundai Elantra CN7 2027',
    passengers: 3,
    luggage: 2,
    colorConfirmed: true,
    colorLabelAr: 'فيراني (رمادي معدني)',
    colorLabelEn: 'Metallic Grey',
    colorSwatchHex: '#596069',
    descriptionAr:
      'سيدان تنفيذية حديثة موديل 2027 باللون الفيراني (رمادي معدني) بتصميم عصري وقيادة سلسة لرحلات العمل واستقبال المطار حتى 3 ركاب وحقيبتين.',
    features: ['مقصورة مريحة وهادئة', 'تكييف أوتوماتيكي', 'ثبات ممتاز بالسفر', 'منافذ شحن USB'],
    imageUrl: elantraGrey2027Img,
  },
  {
    id: 'toyota-corolla',
    modelYear: 2027,
    bookingVehicleCategoryId: 'sedan-luxury',
    group: 'sedan',
    nameAr: 'تويوتا كورولا 2027',
    nameEn: 'Toyota Corolla 2027',
    passengers: 3,
    luggage: 2,
    colorConfirmed: true,
    colorLabelAr: 'فيراني (رمادي معدني)',
    colorLabelEn: 'Metallic Grey',
    colorSwatchHex: '#596069',
    descriptionAr:
      'سيدان اعتمادية موديل 2027 باللون الفيراني (رمادي معدني) للتنقلات الخاصة وخطوط الإسكندرية والقاهرة بأعلى درجات الراحة.',
    features: ['اعتمادية عالية في السفر', 'تعليق مريح للطرق', 'تكييف هواء قوي', 'مساحة خلفية مريحة'],
    imageUrl: corollaGrey2027Img,
  },
  {
    id: 'kia-grand-cerato',
    modelYear: 2027,
    bookingVehicleCategoryId: 'sedan-luxury',
    group: 'sedan',
    nameAr: 'كيا جراند سيراتو 2027',
    nameEn: 'Kia Grand Cerato 2027',
    passengers: 3,
    luggage: 2,
    colorConfirmed: true,
    colorLabelAr: 'فيراني (رمادي معدني)',
    colorLabelEn: 'Metallic Grey',
    colorSwatchHex: '#596069',
    descriptionAr:
      'سيدان تنفيذية ضمن فئة السيدان المريحة باللون الفيراني (رمادي معدني)، تخضع للتخصيص الداخلي للشركة عند التوافر.',
    features: ['صالون داخلي أنيق', 'سلاسة في القيادة', 'تكييف خلفي مريح', 'صندوق أمتعة مناسب'],
    imageUrl: '',
    imageUnavailableReasonAr:
      'لم يتم إنشاء صورة 2027 لهذا الطراز لعدم توفر مرجع بصري رسمي مستقل لموديل 2027 (تم استبدال الاسم تجاريًا قبل 2027).',
  },
];

export function getVerifiedFleetModelById(id: VerifiedFleetModel['id']): VerifiedFleetModel {
  return VERIFIED_FLEET_MODELS.find((m) => m.id === id) || VERIFIED_FLEET_MODELS[0];
}
