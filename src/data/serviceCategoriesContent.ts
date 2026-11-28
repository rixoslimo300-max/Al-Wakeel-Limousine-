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
    cardHeadlineAr: 'ليموزين سيدان من الإسكندرية… مشوار خاص يناسب سفرك',
    cardSummaryAr:
      'لو مسافر بمفردك أو مع مرافقين، اختر سيارة خاصة حتى 3 ركاب وحقيبتين. راجع سعر المسار المعتمد إلى مطار برج العرب أو مطار القاهرة قبل إرسال الحجز.',
    heroEyebrowAr: 'ليموزين سيدان للرحلات الفردية والصغيرة · Comfort Sedan',
    heroTitleAr: 'مسافر للمطار؟ اختَر ليموزين سيدان يناسب عددكم وحقائبكم',
    heroSubtitleAr:
      'خدمة ليموزين سيدان خاصة من الإسكندرية إلى مطار برج العرب أو مطار القاهرة، مناسبة من راكب واحد حتى 3 ركاب وحقيبتين. أدخل تفاصيل رحلتك لمراجعة السعر المعتمد قبل إرسال الحجز.',
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
        'إذا كانت رحلتك فردية أو مع مرافقين، تمنحك فئة السيدان سيارة خاصة لكم وحدكم، دون مشاركة الرحلة مع ركاب آخرين، وبحدود سعة واضحة قبل الاختيار.',
      audienceAr:
        'تناسب المسافر الفردي أو حتى 3 ركاب مع حقيبتين كحد أقصى؛ عندما تريد ترتيب انتقال خاص من الإسكندرية إلى المطار أو لمشوار داخل المدينة.',
      tripTypesAr:
        'يمكنك اختيارها لرحلات الإسكندرية إلى مطار برج العرب أو مطار القاهرة أو مطار سفنكس، وللانتقالات الخاصة الأخرى التي يتيحها التطبيق.',
      customerValueAr:
        'تعرف مسبقًا إن كانت الفئة تناسب عددكم وحقائبكم، وتراجع سعر المسار المعتمد قبل إرسال الطلب. وإذا لم يكن المسار مسعّرًا، يمكنك طلب عرض سعر.',
    },
    experienceBenefits: [
      {
        titleAr: 'سيارة خاصة لكم وحدكم',
        detailAr: 'تنتقل أنت ومرافقوك في سيارة واحدة مخصصة لرحلتكم، دون مشاركة السيارة مع ركاب آخرين.',
      },
      {
        titleAr: 'سعة واضحة قبل اختيار الفئة',
        detailAr: 'تتأكد من توافق عدد الركاب والحقائب مع حدود السيدان قبل إرسال الحجز.',
      },
      {
        titleAr: 'اعرف السعر قبل إرسال الطلب',
        detailAr: 'يعرض التطبيق سعر المسار المعتمد، أو يتيح طلب عرض سعر للمسارات غير المدرجة، دون دفع إلكتروني مقدمًا.',
      },
      {
        titleAr: 'تفاصيل انتظار معلنة قبل الرحلة',
        detailAr: 'راجع سياسة الانتظار المطبقة على نوع الرحلة قبل تأكيد تفاصيل الاستقبال أو الانطلاق.',
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
    cardHeadlineAr: 'مساحة أوسع لركابك وحقائبك… من غير تخمين قبل الحجز',
    cardSummaryAr:
      'لفريق صغير أو عائلة تحتاج مساحة أكبر: حتى 4 ركاب مع 4 حقائب، أو 5–6 ركاب دون حقائب. راجع تفاصيل السعة وسعر المسار قبل إرسال الحجز.',
    heroEyebrowAr: 'ليموزين بريميوم للمساحة الأوسع · Premium',
    heroTitleAr: 'لما تحتاج مساحة أكبر… اختَر ليموزين بريميوم من الإسكندرية',
    heroSubtitleAr:
      'فئة بريميوم لرحلات الإسكندرية إلى المطارات والوجهات المتاحة، بسعة تصل إلى 4 ركاب مع 4 حقائب، أو 5–6 ركاب دون حقائب. قارن السعة واعرف سعر المسار المعتمد قبل إرسال الحجز.',
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
        'عندما لا تكفيك حدود السيدان، تمنحك فئة بريميوم مساحة أوسع وارتفاع جلوس أكبر، مع بيان واضح لما تستوعبه من ركاب وحقائب قبل اتخاذ القرار.',
      audienceAr:
        'تناسب العائلات الصغيرة وضيوف الأعمال والمجموعات التي تحتاج مساحة أكبر، ضمن حد أقصى 4 ركاب مع 4 حقائب، أو 5–6 ركاب دون حقائب.',
      tripTypesAr:
        'اخترها لانتقالات الإسكندرية إلى مطار برج العرب أو مطار القاهرة أو سفنكس، وكذلك للرحلات الخاصة بين المدن والوجهات المتاحة وفق تفاصيل المسار.',
      customerValueAr:
        'بدل التخمين في المساحة، تقارن بين عدد الركاب والحقائب وحدود الفئة قبل الحجز، ثم تراجع سعر المسار المعتمد أو تطلب عرضًا إذا لم يكن مدرجًا.',
    },
    experienceBenefits: [
      {
        titleAr: 'مساحة تناسب الركاب والحقائب',
        detailAr: 'تستوعب حتى 4 ركاب مع 4 حقائب، أو 5–6 ركاب دون حقائب، وفق حدود الفئة.',
      },
      {
        titleAr: 'اختيار مناسب للمجموعات الصغيرة',
        detailAr: 'تساعدك حدود السعة على معرفة ما إذا كانت المجموعة تناسب سيارة واحدة قبل إرسال الطلب.',
      },
      {
        titleAr: 'رحلات خاصة بين المدن',
        detailAr: 'اخترها للانتقالات الخاصة بين الإسكندرية والقاهرة والمطارات والوجهات المتاحة.',
      },
      {
        titleAr: 'رتّب تفاصيل الاستقبال مسبقًا',
        detailAr: 'أدخل بيانات الوصول والموعد عند تقديم الطلب حتى تتم مراجعة تفاصيل التنفيذ معك.',
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
    cardHeadlineAr: 'مجموعة أكبر أو حقائب أكثر؟ خلّي السعة تحدد الفئة المناسبة',
    cardSummaryAr:
      'فئة ميني فان للعائلات والمجموعات عندما تتجاوز حمولة الرحلة سعة الفئات الأصغر. يوازن النظام بين عدد الركاب والحقائب معًا قبل تخصيص المركبة.',
    heroEyebrowAr: 'ليموزين ميني فان للعائلات والمجموعات · Mini Van',
    heroTitleAr: 'لما تكبر المجموعة أو تزيد الحقائب… اختَر ميني فان وفق السعة',
    heroSubtitleAr:
      'خدمة ميني فان من الإسكندرية للمطارات والوجهات المتاحة، للمجموعات والحمولات الأكبر. يحدد النظام الفئة وفق عدد الركاب والحقائب معًا، ويُراجع السعر بعد إدخال تفاصيل الرحلة.',
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
        'عندما لا تكفي سعة الفئات الأصغر، يساعدك خيار ميني فان على ترتيب انتقال المجموعة في مركبة مناسبة، وفق قواعد السعة الفعلية للركاب والحقائب معًا.',
      audienceAr:
        'تناسب العائلات والمجموعات والوفود التي تتجاوز حمولتها حدود الفئات الأصغر. لا يعتمد التخصيص على عدد الركاب أو الحقائب منفردًا، بل على الاثنين معًا.',
      tripTypesAr:
        'يمكن طلبها لاستقبال المجموعات من مطار برج العرب أو مطار القاهرة، وللرحلات الخاصة بين الإسكندرية والساحل الشمالي والمدن والوجهات المتاحة.',
      customerValueAr:
        'بدل تقسيم المجموعة أو التخمين في مساحة الأمتعة، أدخل عدد الركاب والحقائب ليحدد النظام الفئة المناسبة، ثم أرسل تفاصيل المسار لمراجعة السعر قبل التأكيد.',
    },
    experienceBenefits: [
      {
        titleAr: 'السعة تحسب الركاب والحقائب معًا',
        detailAr: 'لا يختار النظام الفئة بعدد الحقائب وحده؛ بل يوازن بين الركاب والحقائب وفق مصفوفة السعة المعتمدة.',
      },
      {
        titleAr: 'رتّب انتقال المجموعة في مركبة مناسبة',
        detailAr: 'عندما تسمح السعة، يساعدك التخصيص على جمع المجموعة في مركبة واحدة بدل توزيعها على أكثر من سيارة.',
      },
      {
        titleAr: 'تعرّف على التخصيص قبل التأكيد',
        detailAr: 'أدخل العددين ليظهر التخصيص المناسب، ثم أرسل المسار والموعد لمراجعة السعر قبل التأكيد.',
      },
      {
        titleAr: 'تفاصيل الصعود والمساحة',
        detailAr: 'راجع صور المقصورة وتفاصيل الفئة لتقدير ملاءمتها لاحتياجات مجموعتك.',
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
        captionAr: 'مساحة للمجموعات الكبيرة مع تخصيص يراعي عدد الركاب والحقائب معًا.',
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
        questionAr: 'متى يخصص تطبيق الوكيل فئة ميني فان؟',
        answerAr:
          'يحدد النظام فئة ميني فان عندما تتجاوز الحمولة سعة الفئات الأصغر: أكثر من 6 ركاب، أو أكثر من 4 ركاب مع حقيبة فأكثر، أو 5 حقائب فأكثر مع 4 ركاب أو أقل. أما 5–6 ركاب دون حقائب فيمكن تخصيص بريميوم لهم.',
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
    cardHeadlineAr: 'ضيافة أرقى ومساحة محسوبة… لفئة مستقلة حتى 4 ركاب',
    cardSummaryAr:
      'لرحلة خاصة بمستوى ضيافة أعلى، ضمن سعة محددة تصل إلى 4 ركاب و5 حقائب. أرسل تفاصيل المسار والموعد لمراجعة السعر قبل التأكيد.',
    heroEyebrowAr: 'ليموزين ميني فان بريميوم للضيافة الخاصة · Premium Mini Van',
    heroTitleAr: 'استقبال يليق بضيوفك… ميني فان بريميوم حتى 4 ركاب',
    heroSubtitleAr:
      'فئة ضيافة مستقلة لرحلات الإسكندرية والمطارات، تستوعب حتى 4 ركاب و5 حقائب كحد أقصى. أدخل الوجهة والموعد والحمولة لطلب مراجعة السعر قبل إرسال الحجز.',
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
        'هذه الفئة ليست مجرد خيار لزيادة عدد الركاب؛ إنها فئة مستقلة لمن يريد مقصورة ضيافة أكثر تميزًا ضمن حدود واضحة للركاب والحقائب.',
      audienceAr:
        'تناسب استقبال الضيوف ورحلات الأعمال والعائلات الصغيرة التي تفضّل مستوى ضيافة أعلى، بشرط ألا يتجاوز العدد 4 ركاب و5 حقائب.',
      tripTypesAr:
        'يمكن طلبها لاستقبال الضيوف من مطار برج العرب أو مطار القاهرة، وللرحلات الخاصة إلى القاهرة والساحل الشمالي والوجهات المتاحة بعد مراجعة المسار.',
      customerValueAr:
        'تعرف حدود الفئة قبل الطلب، وتختار مقصورة ضيافة مستقلة تتسع حتى 4 ركاب و5 حقائب، مع مراجعة السعر وفق مسار الرحلة وتوقيتها.',
    },
    experienceBenefits: [
      {
        titleAr: 'مقصورة ضيافة مستقلة',
        detailAr: 'تختار فئة مخصصة للضيافة الخاصة بدل الخلط بينها وبين ميني فان المجموعات.',
      },
      {
        titleAr: 'حدود سعة واضحة قبل الطلب',
        detailAr: 'تستوعب حتى 4 ركاب و5 حقائب كحد أقصى؛ راجع الأعداد قبل إرسال الطلب.',
      },
      {
        titleAr: 'تجهيزات تناسب استقبال الضيوف',
        detailAr: 'يمكن طلبها لاستقبالات المطارات ورحلات الأعمال وفق تجهيزات الفئة المتاحة.',
      },
      {
        titleAr: 'فئة مستقلة لمن يطلب مستوى أعلى',
        detailAr: 'تظل فئة مستقلة، ويُراجع السعر وفق المسار والموعد وتفاصيل الحمولة.',
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
