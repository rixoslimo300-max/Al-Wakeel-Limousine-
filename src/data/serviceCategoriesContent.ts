import { ServiceCategoryKey } from '../types';
import { ServiceCategorySlug } from './seoCatalog';

import sedanHero from '../assets/images/fleet_elantra_cn7.webp';
import sedanAltExterior from '../assets/images/fleet_toyota_corolla.webp';
import sedanFront from '../assets/images/details/elantra_front.webp';
import sedanInterior from '../assets/images/details/elantra_interior.webp';
import sedanSeating from '../assets/images/details/elantra_seating.webp';
import sedanFinish from '../assets/images/details/elantra_wheel.webp';

import premiumHero from '../assets/images/fleet_soueast_s07.webp';
import premiumAltExterior from '../assets/images/fleet_kia_sportage_2027.webp';
import premiumFront from '../assets/images/details/soueast_front.webp';
import premiumInterior from '../assets/images/details/soueast_interior.webp';
import premiumSeating from '../assets/images/details/soueast_seating.webp';
import premiumFinish from '../assets/images/details/soueast_wheel.webp';

import miniVanHero from '../assets/images/fleet_mitsubishi_xpander_2027.webp';
import miniVanGroupHero from '../assets/images/fleet_toyota_hiace_m55.webp';
import miniVanFront from '../assets/images/details/xpander_front.webp';
import miniVanFamilySeating from '../assets/images/details/xpander_seating.webp';
import miniVanGroupSeating from '../assets/images/details/hiace_seating.webp';
import miniVanFinish from '../assets/images/details/xpander_wheel.webp';

import carnivalHero from '../assets/images/fleet_kia_carnival_2027.webp';
import carnivalFront from '../assets/images/details/carnival_front.webp';
import carnivalInterior from '../assets/images/details/carnival_interior.webp';
import carnivalVipSeating from '../assets/images/details/carnival_seating.webp';
import carnivalFinish from '../assets/images/details/carnival_wheel.webp';

export interface CategoryVisualShot {
  id: string;
  titleAr?: string;
  captionAr?: string;
  altAr: string;
  imageUrl: string;
  aspect: '16:9' | '4:3';
  width: number;
  height: number;
}

export interface CategoryQaItem {
  questionAr: string;
  answerAr: string;
}

export interface ServiceCategoryMarketingSpec {
  slug: ServiceCategorySlug;
  categoryKey: ServiceCategoryKey;
  titleAr: string;
  titleEn: string;
  cardHeadlineAr: string;
  cardSummaryAr: string;
  heroEyebrowAr: string;
  heroTitleAr: string;
  heroSubtitleAr: string;
  heroImageUrl: string;
  heroImageAltAr: string;
  capacitySummaryAr: string;
  luggageSummaryAr: string;
  capacityRuleSummaryAr: string;
  allocationModeLabelAr: string;
  pricingHeadlineAr: string;
  supportsAirportFixedPricing: boolean;
  editorialIntro: {
    natureAr: string;
    audienceAr: string;
    tripTypesAr: string;
    customerValueAr: string;
  };
  experienceBenefits: Array<{
    titleAr: string;
    detailAr: string;
  }>;
  galleryShots: CategoryVisualShot[];
  geoFaqItems: CategoryQaItem[];
}

export const SERVICE_CATEGORY_ALLOCATION_NOTICE_AR =
  'اختيارك يحدد فئة الخدمة، أما السيارة الفعلية فيتم تخصيصها بواسطة الشركة وفقًا لاحتياجات الرحلة والتوافر. الصور المعروضة توضيحية لطبيعة فئة الخدمة.';

export const SERVICE_CATEGORY_CARD_DISCLAIMER_AR =
  'الصور المعروضة توضيحية لطبيعة فئة الخدمة، ويتم تحديد السيارة الفعلية بواسطة الشركة وفقًا لتفاصيل الحجز والتوافر ومتطلبات الرحلة.';

export const SERVICE_CATEGORIES_CONTENT: Record<
  ServiceCategorySlug,
  ServiceCategoryMarketingSpec
> = {
  'sedan-comfort': {
    slug: 'sedan-comfort',
    categoryKey: 'sedan_comfort',
    titleAr: 'سيدان مريحة',
    titleEn: 'Comfort Sedan',
    cardHeadlineAr: 'تجربة انتقال عملية وأنيقة للرحلات الخاصة',
    cardSummaryAr:
      'مثالية للأفراد ورجال الأعمال والأزواج في انتقالات المطارات والاجتماعات بخصوصية تامة وهدوء.',
    heroEyebrowAr: 'فئة الخدمة التنفيذية الأولى · Comfort Sedan',
    heroTitleAr: 'فئة سيدان مريحة: أناقة عملية وهدوء في كل مشوار',
    heroSubtitleAr:
      'انتقال خاص من الباب إلى الباب لـ 1–3 ركاب مع حتى حقيبتين، مصمم للالتزام بالمواعيد وسلاسة الطريق.',
    heroImageUrl: sedanHero,
    heroImageAltAr: 'سيارة فئة سيدان مريحة من الوكيل لخدمات الليموزين',
    capacitySummaryAr: '1–3 ركاب',
    luggageSummaryAr: 'حتى حقيبتين',
    capacityRuleSummaryAr: 'تُقبل تلقائيًا للرحلات حتى 3 ركاب وحقيبتين كحد أقصى.',
    allocationModeLabelAr: 'متاحة للاختيار المباشر',
    pricingHeadlineAr: 'أسعار ثابتة للمطارات المعتمدة تبدأ من 850 ج.م',
    supportsAirportFixedPricing: true,
    editorialIntro: {
      natureAr:
        'تُعد فئة «سيدان مريحة» الخيار المتوازن لرحلات التنقل الخاص التي تتطلب سيارة حديثة هادئة المقصورة وسائقًا محترفًا دون تعقيد.',
      audienceAr:
        'تناسب المسافرين الأفراد، رجال الأعمال، الزوار القادمين عبر المطارات، والأزواج الباحثين عن رحلة خاصة مستقرة ومنظمة.',
      tripTypesAr:
        'تلائم التوصيل والاستقبال في مطار برج العرب ومطار القاهرة ومطار سفنكس، ومواعيد العمل والاجتماعات داخل الإسكندرية أو بين المحافظات.',
      customerValueAr:
        'تحصل على خصوصية كاملة دون مشاركة السيارة، التزام بالموعد مع فترة انتظار مجانية في المطار، وسعر واضح لا يخضع للمفاجآت.',
    },
    experienceBenefits: [
      {
        titleAr: 'خصوصية كاملة ورحلة مباشرة',
        detailAr: 'سيارة خاصة بك وحدك أو بضيوفك من نقطة الانطلاق وحتى باب الوصول دون أي توقفات غير مطلوبة.',
      },
      {
        titleAr: 'مقصورة هادئة وتجربة جلوس مريحة',
        detailAr: 'مقاعد خلفية مريحة ومساحة أرجل متوازنة تتيح لك العمل أو الاسترخاء طوال طريق السفر.',
      },
      {
        titleAr: 'أسعار ثابتة وواضحة للمطارات',
        detailAr: 'رسوم الطريق ودخول المطار مشمولة بالكامل في رحلات المطارات المعتمدة دون دفعات مسبقة.',
      },
      {
        titleAr: 'مرونة مواعيد وانتظار مجاني',
        detailAr: '45 دقيقة انتظار مجانية عند استقبال رحلات المطار و30 دقيقة للرحلات العادية.',
      },
    ],
    galleryShots: [
      {
        id: 'sedan-hero',
        titleAr: 'أناقة التصميم الخارجي',
        captionAr: 'حضور متزن وهادئ يلائم رحلات الأعمال واستقبالات المطارات.',
        altAr: 'سيارة فئة سيدان مريحة لخدمات الليموزين الخاصة',
        imageUrl: sedanHero,
        aspect: '16:9',
        width: 1000,
        height: 558,
      },
      {
        id: 'sedan-ext-alt',
        altAr: 'إطلالة خارجية لفئة سيدان مريحة من الوكيل',
        imageUrl: sedanAltExterior,
        aspect: '16:9',
        width: 1000,
        height: 558,
      },
      {
        id: 'sedan-front',
        titleAr: 'تفاصيل التصميم',
        captionAr: 'خطوط عصرية وإضاءة متناسقة تعكس عناية مستمرة بمستوى الأسطول.',
        altAr: 'تفاصيل التصميم الخارجي لفئة سيدان مريحة',
        imageUrl: sedanFront,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'sedan-seating',
        titleAr: 'تجربة الجلوس والرحابة',
        captionAr: 'مقاعد خلفية مريحة مهيأة للرحلات اليومية ومسافات السفر بين المحافظات.',
        altAr: 'مقاعد الركاب الخلفية في فئة سيدان مريحة',
        imageUrl: sedanSeating,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'sedan-interior',
        titleAr: 'أجواء المقصورة الداخلية',
        captionAr: 'مقصورة مرتبة وهادئة تخضع للتجهيز والنظافة قبل كل رحلة.',
        altAr: 'أجواء المقصورة الداخلية لفئة سيدان مريحة',
        imageUrl: sedanInterior,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'sedan-finish',
        titleAr: 'تفاصيل تعكس مستوى الفئة',
        altAr: 'تفاصيل المظهر الخارجي لفئة سيدان مريحة',
        imageUrl: sedanFinish,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
    ],
    geoFaqItems: [
      {
        questionAr: 'كم راكبًا وحقيبة تستوعب فئة سيدان مريحة؟',
        answerAr:
          'تناسب فئة سيدان مريحة من راكب واحد حتى 3 ركاب بحد أقصى، مع ما يصل إلى حقيبتين. وعند زيادة الحقائب أو الركاب يتحول التخصيص تلقائيًا إلى الفئة الأعلى المناسبة.',
      },
      {
        questionAr: 'ما الفرق بين فئة سيدان مريحة وفئة بريميوم؟',
        answerAr:
          'فئة سيدان مريحة عملية ومناسبة حتى 3 ركاب وحقيبتين بسعر اقتصادي ثابت للمطارات، بينما تمنحك فئة بريميوم مقصورة أرحب وارتفاعًا أكبر وسعة حتى 4 ركاب مع 4 حقائب أو 5–6 ركاب بدون أمتعة.',
      },
      {
        questionAr: 'هل يتم تحديد موديل سيارة معين عند حجز فئة سيدان مريحة؟',
        answerAr:
          'يختار العميل فئة الخدمة (سيدان مريحة)، وتتولى شركة الوكيل لخدمات الليموزين تخصيص السيارة الفعلية الأحدث والمتاحة من نفس المستوى وفق تفاصيل الرحلة.',
      },
    ],
  },

  premium: {
    slug: 'premium',
    categoryKey: 'suv_premium',
    titleAr: 'بريميوم',
    titleEn: 'Premium',
    cardHeadlineAr: 'مستوى أعلى من الخصوصية والحضور والرحابة',
    cardSummaryAr:
      'مصممة لمن يفضل مقصورة أوسع وحضورًا تنفيذيًا مميزًا في السفر واستقبال الشخصيات والعائلات الصغيرة.',
    heroEyebrowAr: 'فئة الحضور التنفيذي · Premium',
    heroTitleAr: 'فئة بريميوم: رحابة إضافية وحضور يليق برحلاتك الخاصة',
    heroSubtitleAr:
      'تجربة انتقال راقية بخصوصية تامة حتى 4 ركاب مع 4 حقائب، أو 5–6 ركاب بدون حقائب.',
    heroImageUrl: premiumHero,
    heroImageAltAr: 'سيارة فئة بريميوم من الوكيل لخدمات الليموزين',
    capacitySummaryAr: '1–4 ركاب بالأمتعة · أو 5–6 بدون حقائب',
    luggageSummaryAr: 'حتى 4 حقائب (مع حتى 4 ركاب)',
    capacityRuleSummaryAr:
      'تُخصَّص تلقائيًا حتى 4 ركاب مع 0–4 حقائب، أو 5–6 ركاب عند عدم وجود حقائب.',
    allocationModeLabelAr: 'متاحة للاختيار المباشر والتخصيص الذكي',
    pricingHeadlineAr: 'أسعار ثابتة للمطارات المعتمدة تبدأ من 1,200 ج.م',
    supportsAirportFixedPricing: true,
    editorialIntro: {
      natureAr:
        'تمثل فئة «بريميوم» نقلة واضحة في الارتفاع المريح عن الطريق، عزل الصوت، واتساع المساحة الداخلية للركاب والأمتعة.',
      audienceAr:
        'تناسب كبار الشخصيات والمديرين التنفيذيين، العائلات الصغيرة ذات الحقائب المتعددة، وضيوف المؤتمرات والفنادق.',
      tripTypesAr:
        'مثالية للرحلات الطويلة بين الإسكندرية والقاهرة والساحل الشمالي، واستقبالات المطار التي تتطلب مساحة أمتعة أكبر حتى 4 حقائب.',
      customerValueAr:
        'تجمع بين الهيبة الخارجية والراحة الداخلية، وتمنح الركاب جلوسًا مرتفعًا ومساحة حركة أفضل في التنقلات اليومية أو السفر.',
    },
    experienceBenefits: [
      {
        titleAr: 'مساحة أرحب للركاب والأمتعة',
        detailAr: 'تستوعب حتى 4 ركاب مع 4 حقائب كاملة براحة دون تكديس داخل المقصورة.',
      },
      {
        titleAr: 'مرونة استيعاب حتى 6 ركاب بدون حقائب',
        detailAr: 'مناسبة للتنقلات التي تضم 5 إلى 6 أفراد دون أمتعة داخل الإسكندرية أو للمشاوير الخاصة.',
      },
      {
        titleAr: 'تجربة سفر هادئة للمسافات الطويلة',
        detailAr: 'مقصورة مرتفعة ومجهزة لتقليل إجهاد الطرق السريعة في رحلات القاهرة والمحافظات.',
      },
      {
        titleAr: 'سائقون مدربون واستقبال احترافي',
        detailAr: 'متابعة دقيقة لمواعيد الطيران والتزام صارم بمعايير الخصوصية واللباقة.',
      },
    ],
    galleryShots: [
      {
        id: 'premium-hero',
        titleAr: 'أناقة التصميم الخارجي',
        captionAr: 'حضور تنفيذي راقٍ يعبر عن مستوى فئة بريميوم أمام صالات السفر.',
        altAr: 'سيارة فئة بريميوم أمام المطار',
        imageUrl: premiumHero,
        aspect: '16:9',
        width: 960,
        height: 540,
      },
      {
        id: 'premium-ext-alt',
        altAr: 'مظهر خارجي راقٍ لفئة بريميوم من الوكيل',
        imageUrl: premiumAltExterior,
        aspect: '16:9',
        width: 1000,
        height: 558,
      },
      {
        id: 'premium-front',
        titleAr: 'تفاصيل التصميم',
        captionAr: 'ملامح خارجية مميزة وإضاءة دقيقة تمنح حضورًا واثقًا على الطريق.',
        altAr: 'تفاصيل التصميم الخارجي لفئة بريميوم',
        imageUrl: premiumFront,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'premium-seating',
        titleAr: 'تجربة الجلوس والرحابة',
        captionAr: 'مقاعد جلدية مطرزة بمساحة أرجل واسعة وسقف بانورامي مضيء.',
        altAr: 'تجربة الجلوس والمساحة الرحبة في فئة بريميوم',
        imageUrl: premiumSeating,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'premium-interior',
        titleAr: 'أجواء المقصورة الداخلية',
        captionAr: 'خامات جلدية وهدوء داخلي يمنح الركاب راحة واضحة طوال الرحلة.',
        altAr: 'أجواء المقصورة الداخلية لفئة بريميوم',
        imageUrl: premiumInterior,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'premium-finish',
        titleAr: 'تفاصيل تعكس مستوى الفئة',
        altAr: 'تفاصيل تعكس مستوى الجودة في فئة بريميوم',
        imageUrl: premiumFinish,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
    ],
    geoFaqItems: [
      {
        questionAr: 'متى أختار فئة بريميوم لرحلتي؟',
        answerAr:
          'اختر فئة بريميوم إذا كان لديك حتى 4 ركاب ومعك 3 إلى 4 حقائب، أو 5–6 ركاب بدون أمتعة، أو إذا كنت تفضل مستوى أعلى من الراحة والارتفاع والحضور.',
      },
      {
        questionAr: 'ماذا يحدث إذا كان مع 5 ركاب حقائب في فئة بريميوم؟',
        answerAr:
          'وفق قواعد السعة المعتمدة، إذا زاد عدد الركاب عن 4 ووجدت حقيبة واحدة فأكثر، يقوم النظام تلقائيًا بتحويل الرحلة إلى فئة ميني فان لضمان استيعاب الركاب والأمتعة.',
      },
      {
        questionAr: 'هل أسعار فئة بريميوم تشمل رسوم المطار والطريق؟',
        answerAr:
          'نعم، أسعار فئة بريميوم المعلنة لمطار برج العرب (1,200 ج.م) ومطار القاهرة (2,200 ج.م) ومطار سفنكس (2,200 ج.م) ثابتة لاتجاه واحد وتشمل رسوم الطريق ودخول المطار.',
      },
    ],
  },

  'mini-van': {
    slug: 'mini-van',
    categoryKey: 'mini_van',
    titleAr: 'ميني فان',
    titleEn: 'Mini Van',
    cardHeadlineAr: 'رحابة متكاملة للعائلات والمجموعات والأمتعة الكبيرة',
    cardSummaryAr:
      'الحل العملي المنظم عند سفر العائلات أو المجموعات حتى 10 ركاب أو عند حمل 5 حقائب فأكثر.',
    heroEyebrowAr: 'فئة العائلات والمجموعات · Mini Van',
    heroTitleAr: 'فئة ميني فان: مساحة متكاملة لكل المسافرين وحقائبهم معًا',
    heroSubtitleAr:
      'تخصيص تلقائي ذكي لاستيعاب 5 حقائب فأكثر أو مجموعات حتى 10 ركاب في رحلة واحدة منظمة.',
    heroImageUrl: miniVanHero,
    heroImageAltAr: 'فئة ميني فان للعائلات والمجموعات من الوكيل لخدمات الليموزين',
    capacitySummaryAr: 'حتى 10 ركاب · أو 1–4 ركاب مع 5 حقائب',
    luggageSummaryAr: 'من 5 حقائب إلى +6 حقائب',
    capacityRuleSummaryAr:
      'تُخصَّص تلقائيًا عند وجود أكثر من 5 حقائب، أو 5 حقائب مع 1–4 ركاب، أو 5–6 ركاب بأمتعة، أو 7–10 ركاب.',
    allocationModeLabelAr: 'تخصيص تلقائي وفق عدد الركاب والأمتعة',
    pricingHeadlineAr: 'السعر بعد مراجعة تفاصيل الرحلة',
    supportsAirportFixedPricing: false,
    editorialIntro: {
      natureAr:
        'فئة «ميني فان» صُممت لتنهي مشكلة تقسيم العائلة أو المجموعة على سيارتين، مع استيعاب حقيقي للأمتعة الكبيرة ومساحة حركة مريحة.',
      audienceAr:
        'تناسب العائلات المسافرة، الوفود السياحية والشركات الصغيرة، والركاب العائدين من السفر الدولي بحقائب متعددة.',
      tripTypesAr:
        'مثالية لاستقبالات المطارات المحملة بالحقائب، رحلات الساحل الشمالي والعلمين، والتنقلات الجماعية بين الإسكندرية والقاهرة.',
      customerValueAr:
        'سفر الجميع في مركبة واحدة مكيّفة وواسعة بتكلفة أوفر وأكثر انضباطًا من حجز أكثر من سيارة، مع مراجعة واضحة للسعر قبل التأكيد.',
    },
    experienceBenefits: [
      {
        titleAr: 'ملاءمة دقيقة لحجم الحقائب',
        detailAr: 'مخصصة لاستيعاب 5 حقائب براحة لـ 1–4 ركاب أو أكثر من 5 حقائب في رحلات المجموعات.',
      },
      {
        titleAr: 'استيعاب مجموعات حتى 10 ركاب',
        detailAr: 'تضم المجموعات الكبيرة والعائلات الممتدة في رحلة واحدة مترابطة دون تشتيت.',
      },
      {
        titleAr: 'تبريد متوازن لكامل المقصورة',
        detailAr: 'مخارج تكييف موزعة للصفوف الخلفية لضمان راحة جميع الركاب في الصيف والسفر الطويل.',
      },
      {
        titleAr: 'سهولة الصعود والنزول بالأمتعة',
        detailAr: 'أبواب واسعة ومساحة داخلية منظمة تسهل حركة كبار السن والأطفال.',
      },
    ],
    galleryShots: [
      {
        id: 'minivan-hero-family',
        titleAr: 'رحابة للعائلات والأمتعة',
        captionAr: 'مركبة عائلية رحبة مهيأة لاستيعاب 5 حقائب مع حتى 4 ركاب براحة تامة.',
        altAr: 'فئة ميني فان العائلية لحمل 5 حقائب',
        imageUrl: miniVanHero,
        aspect: '16:9',
        width: 1000,
        height: 562,
      },
      {
        id: 'minivan-hero-group',
        titleAr: 'مساحة رحبة للمجموعات الكبيرة',
        captionAr: 'سعة واسعة للمجموعات حتى 10 ركاب أو أكثر من 5 حقائب في رحلة واحدة.',
        altAr: 'فئة ميني فان الجماعية للمجموعات الكبيرة',
        imageUrl: miniVanGroupHero,
        aspect: '16:9',
        width: 960,
        height: 540,
      },
      {
        id: 'minivan-family-seating',
        titleAr: 'تجربة الجلوس والرحابة',
        captionAr: 'ترتيب مقاعد مريح مع فتحات تكييف سقفي مستقل للعائلات.',
        altAr: 'المقاعد الداخلية المريحة في فئة ميني فان العائلية',
        imageUrl: miniVanFamilySeating,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'minivan-group-seating',
        titleAr: 'المساحة الداخلية',
        captionAr: 'صفوف مقاعد متعددة بسقف مرتفع وممر مريح للرحلات الجماعية.',
        altAr: 'المساحة الداخلية الواسعة في فئة ميني فان الجماعية',
        imageUrl: miniVanGroupSeating,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'minivan-front',
        titleAr: 'أناقة التصميم الخارجي',
        altAr: 'تفاصيل التصميم الخارجي لفئة ميني فان',
        imageUrl: miniVanFront,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'minivan-finish',
        titleAr: 'تفاصيل تعكس مستوى الفئة',
        altAr: 'تفاصيل المظهر الخارجي لفئة ميني فان',
        imageUrl: miniVanFinish,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
    ],
    geoFaqItems: [
      {
        questionAr: 'أي فئة تناسب العائلات والمجموعات في الوكيل لخدمات الليموزين؟',
        answerAr:
          'فئة «ميني فان» هي الأنسب للمجموعات من 7 إلى 10 ركاب، أو عند وجود أكثر من 4 ركاب مع أمتعة، أو عند حمل 5 حقائب فأكثر، وتُخصَّص تلقائيًا داخل الحجز بمجرد إدخال الأعداد.',
      },
      {
        questionAr: 'كيف يتم حساب سعر رحلة ميني فان؟',
        answerAr:
          'نظرًا لاختلاف طبيعة الحمولة والمسارات في فئة ميني فان، لا يظهر سعر آلي ثابت؛ بل يُعرض «السعر بعد مراجعة تفاصيل الرحلة» لتزويدك بعرض السعر الدقيق قبل تأكيد الحجز.',
      },
      {
        questionAr: 'ما الفرق بين فئة ميني فان وفئة ميني فان بريميوم؟',
        answerAr:
          'فئة «ميني فان» تستوعب السعات الكبيرة حتى 10 ركاب أو +6 حقائب، بينما «ميني فان بريميوم» فئة فاخرة مستقلة بحد أقصى 4 ركاب و5 حقائب فقط لمستوى رفاهية أعلى.',
      },
    ],
  },

  'mini-van-premium': {
    slug: 'mini-van-premium',
    categoryKey: 'mini_van_premium',
    titleAr: 'ميني فان بريميوم',
    titleEn: 'Premium Mini Van',
    cardHeadlineAr: 'تجربة ضيافة فاخرة تجمع بين الرحابة والفخامة التنفيذية',
    cardSummaryAr:
      'فئة مستقلة راقية متاحة عند الطلب حتى 4 ركاب و5 حقائب كحد أقصى — رحلة كبار الشخصيات بلا تنازل.',
    heroEyebrowAr: 'فئة الضيافة الفاخرة المستقلة · Premium Mini Van',
    heroTitleAr: 'فئة ميني فان بريميوم: رفاهية المقاعد الواسعة لرحلات كبار الشخصيات',
    heroSubtitleAr:
      'تجمع بين فخامة الصالون الخاص واتساع المقصورة الفاخرة — متاحة حصريًا حتى 4 ركاب و5 حقائب كحد أقصى.',
    heroImageUrl: carnivalHero,
    heroImageAltAr: 'فئة ميني فان بريميوم الفاخرة من الوكيل لخدمات الليموزين',
    capacitySummaryAr: 'حتى 4 ركاب كحد أقصى',
    luggageSummaryAr: 'حتى 5 حقائب كحد أقصى',
    capacityRuleSummaryAr:
      'فئة مستقلة تشترط تحقق الحدين معًا: لا يزيد الركاب عن 4، ولا تزيد الحقائب عن 5.',
    allocationModeLabelAr: 'فئة مستقلة متاحة عند الطلب (≤ 4 ركاب و≤ 5 حقائب)',
    pricingHeadlineAr: 'السعر بعد مراجعة تفاصيل الرحلة',
    supportsAirportFixedPricing: false,
    editorialIntro: {
      natureAr:
        'فئة «ميني فان بريميوم» ليست بديلًا اقتصاديًا أو مركبة نقل جماعي؛ بل هي تجربة انتقال فاخرة مصممة خصيصًا لمن يطلب أقصى درجات الرفاهية والاتساع في مقصورة واحدة.',
      audienceAr:
        'مخصصة لكبار الشخصيات، الضيوف الدوليين، العائلات الصغيرة الباحثة عن تجربة استرخاء استثنائية، ورحلات الأعمال رفيعة المستوى.',
      tripTypesAr:
        'مثالية لاستقبالات المطارات الفاخرة، الرحلات الخاصة الطويلة إلى القاهرة والساحل الشمالي والعلمين، والتنقلات الرسمية.',
      customerValueAr:
        'تتيح للركاب (حتى 4 أفراد مع ما يصل إلى 5 حقائب) الاستمتاع بمقاعد رحبة تشبه مقصورات رجال الأعمال مع أبواب منزلقة سهلة الدخول وهدوء فائق.',
    },
    experienceBenefits: [
      {
        titleAr: 'تجربة جلوس بمستوى الضيافة الفاخرة',
        detailAr: 'مقصورة فسيحة بمقاعد مريحة وتفاصيل جلدية راقية تجعل المسافات الطويلة تجربة استرخاء.',
      },
      {
        titleAr: 'رحابة للأمتعة دون المساس برفاهية الركاب',
        detailAr: 'سعة مخصصة حتى 4 ركاب و5 حقائب مع بقاء مساحة الحركة والجلوس كاملة.',
      },
      {
        titleAr: 'أبواب منزلقة ودخول سلس',
        detailAr: 'صعود ونزول مريح للغاية أمام الفنادق وصالات المطارات الراقية.',
      },
      {
        titleAr: 'استقلالية تامة وضوابط أهلية واضحة',
        detailAr: 'تظل فئة اختيارية مستقلة لراغبي التميز ضمن حدودها الدقيقة (≤ 4 ركاب و≤ 5 حقائب).',
      },
    ],
    galleryShots: [
      {
        id: 'vip-van-hero',
        titleAr: 'أناقة التصميم الخارجي',
        captionAr: 'حضور فاخر يليق باستقبالات كبار الشخصيات ورحلات الضيافة الراقية.',
        altAr: 'سيارة فئة ميني فان بريميوم من الوكيل لخدمات الليموزين',
        imageUrl: carnivalHero,
        aspect: '16:9',
        width: 1000,
        height: 558,
      },
      {
        id: 'vip-van-seating',
        titleAr: 'تجربة الجلوس والرحابة',
        captionAr: 'مقاعد رحبة ومريحة تمنح ركاب الفئة أعلى مستويات الاسترخاء.',
        altAr: 'مقاعد الركاب الفاخرة في فئة ميني فان بريميوم',
        imageUrl: carnivalVipSeating,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'vip-van-front',
        titleAr: 'تفاصيل التصميم',
        captionAr: 'ملامح راقية تعكس طابع الفخامة الهادئة في كل مشوار.',
        altAr: 'تفاصيل التصميم الخارجي لفئة ميني فان بريميوم',
        imageUrl: carnivalFront,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'vip-van-interior',
        titleAr: 'أجواء المقصورة الداخلية',
        captionAr: 'مقصورة هادئة بتجهيزات جلدية متكاملة ومعايير ضيافة تنفيذية.',
        altAr: 'أجواء المقصورة الداخلية في فئة ميني فان بريميوم',
        imageUrl: carnivalInterior,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
      {
        id: 'vip-van-finish',
        titleAr: 'تفاصيل تعكس مستوى الفئة',
        altAr: 'تفاصيل تعكس الفخامة والجودة في فئة ميني فان بريميوم',
        imageUrl: carnivalFinish,
        aspect: '4:3',
        width: 1200,
        height: 900,
      },
    ],
    geoFaqItems: [
      {
        questionAr: 'ما شروط أهلية حجز فئة ميني فان بريميوم؟',
        answerAr:
          'تُتاح فئة ميني فان بريميوم حصريًا للرحلات التي لا يتجاوز فيها عدد الركاب 4 أفراد ولا يتجاوز فيها عدد الحقائب 5 حقائب معًا. وفي حال 4 ركاب و6 حقائب أو 5 ركاب و5 حقائب، يتم التحويل تلقائيًا إلى الفئة المناسبة.',
      },
      {
        questionAr: 'هل يظهر سعر ثابت لفئة ميني فان بريميوم؟',
        answerAr:
          'نظرًا للطبيعة الفاخرة والمخصصة لهذه الفئة، يتم تحديد السعر بدقة وفق المسار والتوقيت وتعرض حالة التسعير عبارة «السعر بعد مراجعة تفاصيل الرحلة».',
      },
      {
        questionAr: 'ماذا أحتاج لإتمام طلب حجز فئة ميني فان بريميوم؟',
        answerAr:
          'تحديد نقطة التحرك والوجهة والتاريخ والوقت، وإدخال عدد الركاب (بحد أقصى 4) وعدد الحقائب (بحد أقصى 5)، ثم إدخال الاسم ورقم التواصل وإرسال الطلب عبر واتساب لتأكيده مع الإدارة.',
      },
    ],
  },
};

export const ORDERED_SERVICE_CATEGORY_SPECS: ServiceCategoryMarketingSpec[] = [
  SERVICE_CATEGORIES_CONTENT['sedan-comfort'],
  SERVICE_CATEGORIES_CONTENT.premium,
  SERVICE_CATEGORIES_CONTENT['mini-van'],
  SERVICE_CATEGORIES_CONTENT['mini-van-premium'],
];
