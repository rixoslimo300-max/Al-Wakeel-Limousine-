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
    cardHeadlineAr: 'مشوار خاص يناسب رحلاتك الصغيرة من أول خطوة',
    cardSummaryAr:
      'لما تكون من 1 إلى 3 ركاب ومعاكم حقيبتان بحد أقصى، تختار سيدان لانتقال خاص من الإسكندرية إلى المطار دون مشاركة السيارة.',
    heroEyebrowAr: 'فئة الخدمة التنفيذية الأولى · Comfort Sedan',
    heroTitleAr: 'ليموزين سيدان من الإسكندرية للمطار… مساحة مناسبة ومشوار خاص',
    heroSubtitleAr:
      'فئة سيدان مريحة لرحلات 1–3 ركاب وحتى حقيبتين. حدّد موعدك ووجهتك إلى مطار برج العرب أو مطار القاهرة، واعرف السعر المعتمد للمسار قبل إرسال الحجز.',
    heroImageUrl: sedanHero,
    heroImageAltAr: 'سيارة فئة سيدان مريحة من الوكيل لخدمات الليموزين',
    capacitySummaryAr: '1–3 ركاب',
    luggageSummaryAr: 'حتى حقيبتين',
    capacityRuleSummaryAr: 'تُقبل تلقائيًا للرحلات حتى 3 ركاب وحقيبتين كحد أقصى.',
    allocationModeLabelAr: 'متاحة للاختيار المباشر',
    pricingHeadlineAr: 'السعر المعتمد يظهر حسب مسار الرحلة',
    supportsAirportFixedPricing: true,
    editorialIntro: {
      natureAr:
        'لو رحلتك فردية أو مع مرافقين، تمنحك فئة سيدان سيارة خاصة بدل البحث عن وسيلة انتقال مشتركة، مع مساحة محددة تناسب عدد الركاب والحقائب.',
      audienceAr:
        'تناسب المسافر الفردي أو حتى 3 ركاب، ورحلات العمل والاستقبال من مطار برج العرب أو مطار القاهرة، عندما تكون الحمولة ضمن سعة السيدان.',
      tripTypesAr:
        'استخدمها في الانتقال من الإسكندرية إلى مطار برج العرب أو مطار القاهرة أو سفنكس، وكذلك للمشاوير الخاصة والاجتماعات وفق المسار المتاح.',
      customerValueAr:
        'تحصل على سيارة مخصصة لك ولرفاقك، وتعرف تكلفة المسار المعتمد قبل إرسال الحجز؛ وإذا كان المسار غير مسعّر يمكنك طلب عرض سعر.',
    },
    experienceBenefits: [
      {
        titleAr: 'سيارة خاصة لك ولرفاقك',
        detailAr: 'تنتقل أنت ومرافقوك في سيارة واحدة مخصصة لرحلتكم، دون مشاركة الرحلة مع ركاب آخرين.',
      },
      {
        titleAr: 'مساحة عملية لرحلة يومك',
        detailAr: 'مساحة مناسبة لرحلات المدينة والمطار عندما تكون أعداد الركاب والحقائب ضمن سعة الفئة.',
      },
      {
        titleAr: 'اعرف تكلفة المسار قبل التأكيد',
        detailAr: 'يعرض التطبيق السعر المعتمد للمسارات المسعّرة، وتظهر تفاصيل الرحلة قبل إرسال الطلب؛ لا تدفع إلكترونيًا مقدمًا.',
      },
      {
        titleAr: 'تفاصيل انتظار معلنة قبل الرحلة',
        detailAr: 'تظهر سياسة الانتظار المطبقة على نوع الرحلة بوضوح، حتى تعرف المدة المتاحة عند الاستقبال أو الانطلاق.',
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
    cardHeadlineAr: 'مساحة أوسع لركابك وحقائبك في الرحلات الخاصة',
    cardSummaryAr:
      'لو تحتاج مساحة أكبر، تمنحك فئة بريميوم اختيارًا مناسبًا حتى 4 ركاب مع 4 حقائب، أو 5–6 ركاب دون حقائب.',
    heroEyebrowAr: 'فئة الحضور التنفيذي · Premium',
    heroTitleAr: 'ليموزين بريميوم من الإسكندرية… مساحة أكبر لرحلتك',
    heroSubtitleAr:
      'اختيار مناسب لرحلات الإسكندرية إلى المطارات والسفر بين المحافظات: حتى 4 ركاب مع 4 حقائب، أو 5–6 ركاب دون حقائب. اختر الفئة واعرف السعر المعتمد للمسار قبل تأكيد الطلب.',
    heroImageUrl: premiumHero,
    heroImageAltAr: 'سيارة فئة بريميوم من الوكيل لخدمات الليموزين',
    capacitySummaryAr: '1–4 ركاب بالأمتعة · أو 5–6 بدون حقائب',
    luggageSummaryAr: 'حتى 4 حقائب (مع حتى 4 ركاب)',
    capacityRuleSummaryAr:
      'تُخصَّص تلقائيًا حتى 4 ركاب مع 0–4 حقائب، أو 5–6 ركاب عند عدم وجود حقائب.',
    allocationModeLabelAr: 'متاحة للاختيار المباشر والتخصيص الذكي',
    pricingHeadlineAr: 'السعر المعتمد يظهر حسب مسار الرحلة',
    supportsAirportFixedPricing: true,
    editorialIntro: {
      natureAr:
        'عندما لا تكفيك مساحة السيدان، تمنحك بريميوم مقصورة أوسع وارتفاع جلوس أكبر، مع حدود سعة واضحة تساعدك على اختيار الفئة المناسبة.',
      audienceAr:
        'تناسب من يريد مساحة أوسع في رحلة خاصة، والعائلات الصغيرة، وضيوف الأعمال، بشرط توافق عدد الركاب والحقائب مع السعة المعلنة.',
      tripTypesAr:
        'تلائم انتقالات الإسكندرية إلى مطار برج العرب ومطار القاهرة وسفنكس، والرحلات الخاصة بين المدن والساحل الشمالي وفق تفاصيل المسار.',
      customerValueAr:
        'تختار مساحة تتناسب مع حمولة رحلتك بدل الاكتفاء باسم السيارة؛ وتراجع السعر المعتمد أو تطلب عرضًا قبل إرسال الحجز.',
    },
    experienceBenefits: [
      {
        titleAr: 'أربع حقائب مع مساحة محسوبة',
        detailAr: 'تستوعب حتى 4 ركاب مع 4 حقائب وفق حدود الفئة، لتعرف قبل الحجز إن كانت المساحة تناسب مجموعتك.',
      },
      {
        titleAr: 'مناسبة لمجموعة حتى 6 أفراد دون حقائب',
        detailAr: 'إذا كنتم 5 أو 6 ركاب دون حقائب، تتيح قواعد التخصيص اختيار فئة بريميوم بدل تقسيم المجموعة.',
      },
      {
        titleAr: 'مساحة أوسع للمشاوير بين المدن',
        detailAr: 'المقصورة الأوسع مناسبة للانتقالات الطويلة بين الإسكندرية والقاهرة والوجهات المتاحة.',
      },
      {
        titleAr: 'تفاصيل استقبال منظمة',
        detailAr: 'نسّق بيانات الوصول وموعد الاستقبال عند تقديم طلبك، وتواصل مع مكتب الحجز لتأكيد تفاصيل التنفيذ.',
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
          'تناسب بريميوم حتى 4 ركاب مع 0–4 حقائب، أو 5–6 ركاب دون حقائب. إذا زاد عدد الركاب عن 4 ووجدت حقيبة واحدة فأكثر، يوجّهك النظام إلى فئة ميني فان المناسبة.',
      },
      {
        questionAr: 'ماذا يحدث إذا كان مع 5 ركاب حقائب في فئة بريميوم؟',
        answerAr:
          'وفق قواعد السعة المعتمدة، إذا زاد عدد الركاب عن 4 ووجدت حقيبة واحدة فأكثر، يقوم النظام تلقائيًا بتحويل الرحلة إلى فئة ميني فان لضمان استيعاب الركاب والأمتعة.',
      },
      {
        questionAr: 'هل أسعار فئة بريميوم تشمل رسوم المطار والطريق؟',
        answerAr:
          'يعرض التطبيق السعر المعتمد للمسار المختار قبل إرسال الحجز. رحلة العودة تُسعّر بصورة مستقلة، وأي مسار غير مدرج يظهر له طلب عرض سعر.',
      },
    ],
  },

  'mini-van': {
    slug: 'mini-van',
    categoryKey: 'mini_van',
    titleAr: 'ميني فان',
    titleEn: 'Mini Van',
    cardHeadlineAr: 'لما تزيد الحمولة… خلي اختيار السيارة مبني على السعة',
    cardSummaryAr:
      'تُحدد فئة ميني فان وفق عدد الركاب والحقائب معًا؛ لتناسب المجموعات الأكبر أو الحمولة التي تتجاوز سعة الفئات الأصغر.',
    heroEyebrowAr: 'فئة العائلات والمجموعات · Mini Van',
    heroTitleAr: 'ميني فان للمجموعات والحقائب… رحلة واحدة بدل تقسيمها',
    heroSubtitleAr:
      'يحسب النظام عدد الركاب والحقائب معًا، ثم يحدد فئة ميني فان عندما تتجاوز الحمولة سعة الفئات الأصغر؛ حتى 10 ركاب وفق حدود النظام.',
    heroImageUrl: miniVanHero,
    heroImageAltAr: 'فئة ميني فان للعائلات والمجموعات من الوكيل لخدمات الليموزين',
    capacitySummaryAr: 'حتى 10 ركاب وفق قواعد السعة',
    luggageSummaryAr: 'تُحدد مع عدد الركاب',
    capacityRuleSummaryAr:
      'تُخصَّص عند تجاوز سعة الفئات الأصغر: أكثر من 6 ركاب، أو أكثر من 4 ركاب مع حقيبة فأكثر، أو 5 حقائب فأكثر مع 4 ركاب أو أقل.',
    allocationModeLabelAr: 'تخصيص تلقائي وفق عدد الركاب والأمتعة',
    pricingHeadlineAr: 'السعر بعد مراجعة تفاصيل الرحلة',
    supportsAirportFixedPricing: false,
    editorialIntro: {
      natureAr:
        'لو عددكم كبير أو حقائبكم كثيرة، تساعدك فئة ميني فان على جمع الرحلة في مركبة واحدة عندما تسمح مصفوفة السعة بذلك، بدل توزيع المجموعة على أكثر من سيارة.',
      audienceAr:
        'تناسب العائلات والمجموعات والوفود التي تتجاوز حمولتها حدود الفئات الأصغر، وفق الجمع بين عدد الركاب والحقائب.',
      tripTypesAr:
        'استخدمها عند ترتيب استقبال جماعي من مطار برج العرب أو مطار القاهرة، أو في الرحلات الخاصة بين الإسكندرية والساحل الشمالي والمدن الأخرى.',
      customerValueAr:
        'تقلل الحاجة إلى توزيع أفراد المجموعة على أكثر من سيارة عندما تسمح السعة، وتتيح لك مراجعة عرض السعر النهائي قبل تأكيد الرحلة.',
    },
    experienceBenefits: [
      {
        titleAr: 'تخصيص يراعي الركاب والحقائب معًا',
        detailAr: 'لا يعتمد الاختيار على عدد الحقائب وحده؛ النظام يوازن بين عدد الركاب والحقائب ويخصص ميني فان عندما تتجاوز الحمولة سعة الفئات الأصغر.',
      },
      {
        titleAr: 'اجمع مجموعتك في رحلة واحدة',
        detailAr: 'تصل سعة الفئة إلى 10 ركاب وفق قواعد النظام، مع تحديد المركبة بحسب العدد والحمولة.',
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
        questionAr: 'يحدد النظام فئة ميني فان عندما تتجاوز الحمولة سعة الفئات الأصغر: أكثر من 6 ركاب، أو أكثر من 4 ركاب مع حقيبة فأكثر، أو 5 حقائب فأكثر مع 4 ركاب أو أقل. أما 5–6 ركاب دون حقائب فيمكن تخصيص بريميوم لهم.',
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
          'ميني فان تُحدد وفق مصفوفة السعة للمجموعات والحمولات الأكبر حتى 10 ركاب. أما ميني فان بريميوم فهي فئة مستقلة متاحة حتى 4 ركاب و5 حقائب كحد أقصى.',
      },
    ],
  },

  'mini-van-premium': {
    slug: 'mini-van-premium',
    categoryKey: 'mini_van_premium',
    titleAr: 'ميني فان بريميوم',
    titleEn: 'Premium Mini Van',
    cardHeadlineAr: 'مقصورة ضيافة أوسع لرحلتك الخاصة',
    cardSummaryAr:
      'لمن يريد مقصورة أكثر فخامة دون تجاوز السعة: حتى 4 ركاب و5 حقائب كحد أقصى، مع مراجعة السعر قبل تأكيد الطلب.',
    heroEyebrowAr: 'فئة الضيافة الفاخرة المستقلة · Premium Mini Van',
    heroTitleAr: 'ميني فان بريميوم… ضيافة خاصة حتى 4 ركاب و5 حقائب',
    heroSubtitleAr:
      'مقصورة ضيافة مستقلة لرحلات الإسكندرية والمطارات حتى 4 ركاب و5 حقائب. حدّد مسارك وتفاصيل الرحلة لطلب السعر قبل تأكيد الحجز.',
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
        'ليست مجرد وسيلة لنقل عدد أكبر؛ إنها فئة مستقلة لمن يريد مقصورة ضيافة أكثر فخامة ضمن سعة محددة، مع معرفة السعر بعد مراجعة تفاصيل الرحلة.',
      audienceAr:
        'تناسب استقبال الضيوف ورحلات الأعمال والعائلات الصغيرة التي تفضّل مستوى ضيافة أعلى، بشرط ألا تتجاوز الرحلة 4 ركاب و5 حقائب.',
      tripTypesAr:
        'تلائم استقبال الضيوف من مطار برج العرب أو مطار القاهرة، والرحلات الخاصة إلى القاهرة والساحل الشمالي وفق المسار المتاح.',
      customerValueAr:
        'تستفيد من مقاعد أكثر رحابة ومساحة أمتعة تصل إلى 5 حقائب، مع دخول أسهل للمقصورة؛ ضمن حد أقصى 4 ركاب.',
    },
    experienceBenefits: [
      {
        titleAr: 'مقصورة مصممة لضيافة راقية',
        detailAr: 'مقاعد رحبة وتفاصيل داخلية راقية تمنح رحلتك طابع ضيافة مختلفًا، وفق تجهيزات الفئة المتاحة.',
      },
      {
        titleAr: 'مساحة للركاب والحقائب ضمن حدود الفئة',
        detailAr: 'تستوعب حتى 4 ركاب و5 حقائب كحد أقصى؛ راجع الأعداد قبل إرسال الطلب للتأكد من أهلية الفئة.',
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
          'تتاح فئة ميني فان بريميوم إذا كان عدد الركاب 1–4 وعدد الحقائب 0–5. إذا تجاوزت أحد الحدين، يوجّهك النظام إلى فئة أخرى مناسبة للسعة.',
      },
      {
        questionAr: 'هل يظهر سعر ثابت لفئة ميني فان بريميوم؟',
        answerAr:
          'نظرًا للطبيعة الفاخرة والمخصصة لهذه الفئة، يتم تحديد السعر بدقة وفق المسار والتوقيت وتعرض حالة التسعير عبارة «السعر بعد مراجعة تفاصيل الرحلة».',
      },
      {
        questionAr: 'كيف أطلب ميني فان بريميوم من الإسكندرية أو المطارات؟',
        answerAr:
          'أدخل نقطة التحرك والوجهة والتاريخ والوقت، ثم عدد الركاب والحقائب ضمن الحد الأقصى للفئة. راجع السعر الذي يظهر بعد مراجعة التفاصيل، ثم أرسل طلب الحجز لتأكيده مع الإدارة.',
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
