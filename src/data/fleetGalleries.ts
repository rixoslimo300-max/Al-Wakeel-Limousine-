import { VerifiedFleetModel } from './verifiedFleet';

import soueastHero from '../assets/images/fleet_soueast_s07.webp';
import soueastFront from '../assets/images/details/soueast_front.webp';
import soueastWheel from '../assets/images/details/soueast_wheel.webp';
import soueastInterior from '../assets/images/details/soueast_interior.webp';
import soueastSeating from '../assets/images/details/soueast_seating.webp';

import sportageHero from '../assets/images/fleet_kia_sportage_2027.webp';
import sportageFront from '../assets/images/details/sportage_front.webp';
import sportageWheel from '../assets/images/details/sportage_wheel.webp';
import sportageInterior from '../assets/images/details/sportage_interior.webp';
import sportageSeating from '../assets/images/details/sportage_seating.webp';

import carnivalHero from '../assets/images/fleet_kia_carnival_2027.webp';
import carnivalFront from '../assets/images/details/carnival_front.webp';
import carnivalWheel from '../assets/images/details/carnival_wheel.webp';
import carnivalInterior from '../assets/images/details/carnival_interior.webp';
import carnivalSeating from '../assets/images/details/carnival_seating.webp';

import xpanderHero from '../assets/images/fleet_mitsubishi_xpander_2027.webp';
import xpanderFront from '../assets/images/details/xpander_front.webp';
import xpanderWheel from '../assets/images/details/xpander_wheel.webp';
import xpanderInterior from '../assets/images/details/xpander_interior.webp';
import xpanderSeating from '../assets/images/details/xpander_seating.webp';

import hiaceHero from '../assets/images/fleet_toyota_hiace_m55.webp';
import hiaceFront from '../assets/images/details/hiace_front.webp';
import hiaceWheel from '../assets/images/details/hiace_wheel.webp';
import hiaceInterior from '../assets/images/details/hiace_interior.webp';
import hiaceSeating from '../assets/images/details/hiace_seating.webp';

import elantraHero from '../assets/images/fleet_elantra_cn7.webp';
import elantraFront from '../assets/images/details/elantra_front.webp';
import elantraWheel from '../assets/images/details/elantra_wheel.webp';
import elantraInterior from '../assets/images/details/elantra_interior.webp';
import elantraSeating from '../assets/images/details/elantra_seating.webp';

import corollaHero from '../assets/images/fleet_toyota_corolla.webp';
import corollaFront from '../assets/images/details/corolla_front.webp';
import corollaWheel from '../assets/images/details/corolla_wheel.webp';
import corollaInterior from '../assets/images/details/corolla_interior.webp';
import corollaSeating from '../assets/images/details/corolla_seating.webp';

export type GalleryShotCategory = 'hero' | 'front' | 'wheel' | 'interior' | 'seating';

export interface VehicleGalleryShot {
  category: GalleryShotCategory;
  labelAr: string;
  captionAr: string;
  imageUrl: string;
  aspect: '16:9' | '4:3';
  width: number;
  height: number;
}

export const FLEET_DETAIL_GALLERIES: Record<VerifiedFleetModel['id'], VehicleGalleryShot[]> = {
  'soueast-s07': [
    {
      category: 'hero',
      labelAr: 'النظرة الخارجية الرئيسية',
      captionAr: 'سوايست S07 موديل 2027 باللون الأسود اللامع — الواجهة الجانبية الثلاثية الأبعاد.',
      imageUrl: soueastHero,
      aspect: '16:9',
      width: 960,
      height: 540,
    },
    {
      category: 'front',
      labelAr: 'الواجهة والمصابيح',
      captionAr: 'تفاصيل الشبكة الأمامية Starry Digital والمصابيح النهارية LED بتشطيب كروم فاخر.',
      imageUrl: soueastFront,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'wheel',
      labelAr: 'الطلاء والجنوط',
      captionAr: 'جودة الطلاء الأسود العميق مع خطوط الهيكل الجانبية وتصميم الجنوط الرياضية 20 بوصة.',
      imageUrl: soueastWheel,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'interior',
      labelAr: 'المقصورة والقيادة',
      captionAr: 'قمرة قيادة متطورة بشاشات مزدوجة منحنية، خامات جلدية مطرزة، وناقل حركة بلوري.',
      imageUrl: soueastInterior,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'seating',
      labelAr: 'المقاعد والرحابة',
      captionAr: 'مقاعد خلفية بجلد مبطن، فتحة سقف بانورامية، وتكييف خلفي مستقل لراحة الركاب.',
      imageUrl: soueastSeating,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
  ],
  'kia-sportage': [
    {
      category: 'hero',
      labelAr: 'النظرة الخارجية الرئيسية',
      captionAr: 'كيا سبورتاج 2027 باللون الأسود الفاخر بالتحديث الأمامي الجديد.',
      imageUrl: sportageHero,
      aspect: '16:9',
      width: 1000,
      height: 558,
    },
    {
      category: 'front',
      labelAr: 'الواجهة والمصابيح',
      captionAr: 'إضاءة LED عمودية ثلاثية المكعبات مع بصمة Star Map النهارية وشبكة أنف النمر.',
      imageUrl: sportageFront,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'wheel',
      labelAr: 'الطلاء والجنوط',
      captionAr: 'لمعان الطلاء الأسود مع خطوط الهيكل المنحوتة والجنوط الهندسية ثنائية اللون.',
      imageUrl: sportageWheel,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'interior',
      labelAr: 'المقصورة والقيادة',
      captionAr: 'مقصورة حديثة بشاشة بانورامية مزدوجة 12.3 بوصة وعجلة قيادة رياضية ثنائية الأضلاع.',
      imageUrl: sportageInterior,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'seating',
      labelAr: 'المقاعد والرحابة',
      captionAr: 'مقاعد جلدية مثقبة بتطريز متقن ومساحة أرجل واسعة مع منافذ تكييف وشحن خلفية.',
      imageUrl: sportageSeating,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
  ],
  'kia-carnival': [
    {
      category: 'hero',
      labelAr: 'النظرة الخارجية الرئيسية',
      captionAr: 'كيا كارنيفال 2027 باللون الأسود الفاخر — قمة فئة ميني فان بريميوم.',
      imageUrl: carnivalHero,
      aspect: '16:9',
      width: 1000,
      height: 558,
    },
    {
      category: 'front',
      labelAr: 'الواجهة والمصابيح',
      captionAr: 'الواجهة المهيبة بمصابيح Star Map العمودية والشبكة المعدنية الفاخرة.',
      imageUrl: carnivalFront,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'wheel',
      labelAr: 'الطلاء والجنوط',
      captionAr: 'طلاء Aurora Black Pearl العميق مع خطوط الفخامة الجانبية وجنوط 19 بوصة.',
      imageUrl: carnivalWheel,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'interior',
      labelAr: 'المقصورة والقيادة',
      captionAr: 'قمرة تنفيذية بشاشة بانورامية متصلة وتطعيمات جلدية فاخرة وتفاصيل معدنية.',
      imageUrl: carnivalInterior,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'seating',
      labelAr: 'المقاعد والرحابة',
      captionAr: 'مقصورة كبار الشخصيات VIP Lounge بمقاعد استرخاء خلفية ومسند أقدام وأبواب منزلقة كهربائيًا.',
      imageUrl: carnivalSeating,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
  ],
  'mitsubishi-xpander': [
    {
      category: 'hero',
      labelAr: 'النظرة الخارجية الرئيسية',
      captionAr: 'ميتسوبيشي إكسباندر 2027 باللون الفيراني (رمادي معدني) بتصميم Dynamic Shield.',
      imageUrl: xpanderHero,
      aspect: '16:9',
      width: 1000,
      height: 562,
    },
    {
      category: 'front',
      labelAr: 'الواجهة والمصابيح',
      captionAr: 'مصابيح LED بشكل T الأيقونية مع لمسات الكروم المعدني بالواجهة الأمامية.',
      imageUrl: xpanderFront,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'wheel',
      labelAr: 'الطلاء والجنوط',
      captionAr: 'الطلاء الفيراني المعدني مع انسيابية الهيكل الجانبي والجنوط ثنائية التشطيب.',
      imageUrl: xpanderWheel,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'interior',
      labelAr: 'المقصورة والقيادة',
      captionAr: 'تابلوه أفقي مبطن بخياطة حقيقية، شاشة لمس 9 بوصة، وتحكم رقمي في التكييف.',
      imageUrl: xpanderInterior,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'seating',
      labelAr: 'المقاعد والرحابة',
      captionAr: 'رحابة عملية للعائلات والأمتعة مع فتحات تكييف سقفي مستقل للمقاعد الخلفية.',
      imageUrl: xpanderSeating,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
  ],
  'toyota-hiace-m55': [
    {
      category: 'hero',
      labelAr: 'النظرة الخارجية الرئيسية',
      captionAr: 'تويوتا هاي إيس M55 موديل 2027 باللون الأبيض اللؤلؤي لرحلات المجموعات.',
      imageUrl: hiaceHero,
      aspect: '16:9',
      width: 960,
      height: 540,
    },
    {
      category: 'front',
      labelAr: 'الواجهة والمصابيح',
      captionAr: 'واجهة H300 المهيبة باللون الأبيض اللؤلؤي مع الشبكة المعدنية والمصابيح الكريستالية.',
      imageUrl: hiaceFront,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'wheel',
      labelAr: 'الطلاء والجنوط',
      captionAr: 'جسم الفان التنفيذي عالي السقف بدرجة اللؤلؤي النقي مع عتبة الصعود المريحة.',
      imageUrl: hiaceWheel,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'interior',
      labelAr: 'المقصورة والقيادة',
      captionAr: 'قمرة قيادة عالية الرؤية بمقبض نقل حركة مدمج في الكونسول وتجهيزات عمل متينة.',
      imageUrl: hiaceInterior,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'seating',
      labelAr: 'المقاعد والرحابة',
      captionAr: 'مقصورة سياحية عالية السقف تتسع حتى 10 ركاب مع ممر وسطي مريح وتكييف مركزي.',
      imageUrl: hiaceSeating,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
  ],
  'hyundai-elantra-cn7': [
    {
      category: 'hero',
      labelAr: 'النظرة الخارجية الرئيسية',
      captionAr: 'هيونداي إلنترا CN7 موديل 2027 باللون الفيراني (رمادي معدني) بتصميم هندسي حاد.',
      imageUrl: elantraHero,
      aspect: '16:9',
      width: 1000,
      height: 558,
    },
    {
      category: 'front',
      labelAr: 'الواجهة والمصابيح',
      captionAr: 'التصميم الأمامي الرياضي المحدث مع المصابيح النهارية الممتدة وشبكة Parametric.',
      imageUrl: elantraFront,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'wheel',
      labelAr: 'الطلاء والجنوط',
      captionAr: 'خطوط التصميم الجوهرية الحادة في الطلاء الفيراني المعدني مع الجنوط الرياضية.',
      imageUrl: elantraWheel,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'interior',
      labelAr: 'المقصورة والقيادة',
      captionAr: 'قمرة قيادة موجهة للسائق بشاشتين مدمجتين وتفاصيل كونسول وسطي عصري.',
      imageUrl: elantraInterior,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'seating',
      labelAr: 'المقاعد والرحابة',
      captionAr: 'مقصورة خلفية هادئة بتنجيد متقن ومساحة أرجل ممتازة لرحلات الأعمال والسفر.',
      imageUrl: elantraSeating,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
  ],
  'toyota-corolla': [
    {
      category: 'hero',
      labelAr: 'النظرة الخارجية الرئيسية',
      captionAr: 'تويوتا كورولا 2027 باللون الفيراني (رمادي معدني) — الاعتمادية التنفيذية.',
      imageUrl: corollaHero,
      aspect: '16:9',
      width: 1000,
      height: 558,
    },
    {
      category: 'front',
      labelAr: 'الواجهة والمصابيح',
      captionAr: 'مصابيح أمامية حادة بتقنية LED بتصميم J-shape ولمسات كروم راقية.',
      imageUrl: corollaFront,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'wheel',
      labelAr: 'الطلاء والجنوط',
      captionAr: 'الطلاء الفيراني المعدني اللامع مع انسيابية الجوانب وجنوط 17 بوصة متعددة الأضلاع.',
      imageUrl: corollaWheel,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'interior',
      labelAr: 'المقصورة والقيادة',
      captionAr: 'لوحة قيادة مريحة أفقية التصميم بشاشة عائمة ومواد ناعمة الملمس.',
      imageUrl: corollaInterior,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
    {
      category: 'seating',
      labelAr: 'المقاعد والرحابة',
      captionAr: 'مقاعد خلفية مريحة مع مسند يد وسطي ومخارج تكييف لرحلات مريحة بين المحافظات.',
      imageUrl: corollaSeating,
      aspect: '4:3',
      width: 800,
      height: 600,
    },
  ],
  'kia-grand-cerato': [],
};
