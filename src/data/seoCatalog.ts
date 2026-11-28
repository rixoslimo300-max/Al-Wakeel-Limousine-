import { ServiceCategoryKey } from '../types.ts';

export type ServiceCategorySlug =
  | 'sedan-comfort'
  | 'premium'
  | 'mini-van'
  | 'mini-van-premium';

export interface ServiceSeoEntry {
  key: ServiceCategoryKey;
  slug: ServiceCategorySlug;
  path: `/services/${ServiceCategorySlug}`;
  nameAr: string;
  nameEn: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImagePath: `/og/${ServiceCategorySlug}.jpg`;
  ogImageAltAr: string;
}

export const DEFAULT_PUBLIC_SITE_URL = 'https://wakeel-limousine.pages.dev';

export function resolveSiteOrigin(explicitOrigin?: string | null): string {
  const candidate = (explicitOrigin || '').trim().replace(/\/+$/, '');
  if (candidate && /^https?:\/\//i.test(candidate)) {
    return candidate;
  }
  return DEFAULT_PUBLIC_SITE_URL;
}

export const HOME_SEO = {
  title: 'ليموزين خاص من الإسكندرية للمطارات والرحلات | Al Wakeel Limousine',
  metaDescription:
    'خدمات ليموزين خاصة من الإسكندرية إلى مطارات برج العرب والقاهرة وسفنكس، وإلى الساحل الشمالي ووجهات أخرى حسب الطلب. اختر فئة الخدمة وفق عدد الركاب والحقائب، وراجع السعر المعتمد أو اطلب عرض سعر قبل إرسال الحجز.',
  ogTitle: 'ليموزين خاص من الإسكندرية إلى المطارات والوجهات | Al Wakeel Limousine',
  ogDescription:
    'من الإسكندرية إلى المطارات والوجهات الرئيسية، اختر فئة الليموزين الملائمة لعدد الركاب والحقائب. راجع السعر المعتمد أو اطلب عرض سعر للمسارات غير المدرجة قبل إرسال الحجز.',
  ogImagePath: '/og/al-wakeel-home.jpg',
  ogImageAltAr: 'خدمة الليموزين التنفيذي والنقل الخاص من Al Wakeel Limousine',
};

export const SERVICE_SEO_CATALOG: Record<ServiceCategorySlug, ServiceSeoEntry> = {
  'sedan-comfort': {
    key: 'sedan_comfort',
    slug: 'sedan-comfort',
    path: '/services/sedan-comfort',
    nameAr: 'سيدان مريحة',
    nameEn: 'Comfort Sedan',
    seoTitle: 'ليموزين سيدان من الإسكندرية إلى المطارات | الوكيل',
    metaDescription:
      'ليموزين سيدان خاص من الإسكندرية إلى مطار برج العرب أو مطار القاهرة أو مطار سفنكس، حتى 3 ركاب وحقيبتين. راجع سعر المسار المعتمد قبل إرسال الحجز.',
    ogTitle: 'سيدان خاصة للمطار حتى 3 ركاب | Al Wakeel Limousine',
    ogDescription:
      'رحلة خاصة للأفراد والمجموعات الصغيرة من الإسكندرية إلى المطارات، مع سعة واضحة وسعر للمسارات المعتمدة قبل تأكيد الطلب.',
    ogImagePath: '/og/sedan-comfort.jpg',
    ogImageAltAr: 'فئة سيدان مريحة للتنقل الخاص من الوكيل لخدمات الليموزين',
  },
  premium: {
    key: 'suv_premium',
    slug: 'premium',
    path: '/services/premium',
    nameAr: 'بريميوم',
    nameEn: 'Premium',
    seoTitle: 'ليموزين بريميوم من الإسكندرية إلى المطارات | الوكيل',
    metaDescription:
      'اختر ليموزين بريميوم من الإسكندرية إلى المطارات لمساحة تناسب حتى 4 ركاب و4 حقائب، أو 5–6 ركاب دون حقائب. راجع سعر المسار المعتمد قبل إرسال الحجز.',
    ogTitle: 'فئة بريميوم بمساحة أوسع للركاب والحقائب | Al Wakeel Limousine',
    ogDescription:
      'اختر فئة بريميوم لرحلتك الخاصة من الإسكندرية إلى المطارات أو بين المدن، وفق حدود السعة المعتمدة وسعر المسار الظاهر بالتطبيق.',
    ogImagePath: '/og/premium.jpg',
    ogImageAltAr: 'فئة بريميوم للتنقل التنفيذي الخاص من الوكيل لخدمات الليموزين',
  },
  'mini-van': {
    key: 'mini_van',
    slug: 'mini-van',
    path: '/services/mini-van',
    nameAr: 'ميني فان',
    nameEn: 'Mini Van',
    seoTitle: 'ليموزين ميني فان للعائلات والمجموعات من الإسكندرية | الوكيل',
    metaDescription:
      'ليموزين ميني فان للعائلات والمجموعات من الإسكندرية إلى المطارات والوجهات المتاحة. يحدد النظام التخصيص وفق عدد الركاب والحقائب معًا، حتى 10 ركاب وفق حدود السعة.',
    ogTitle: 'ميني فان للعائلات والمجموعات | Al Wakeel Limousine',
    ogDescription:
      'اجمع مجموعتك في رحلة واحدة عندما تسمح السعة. يوازن نظام الحجز بين عدد الركاب والحقائب ويعرض السعر بعد مراجعة تفاصيل المسار.',
    ogImagePath: '/og/mini-van.jpg',
    ogImageAltAr: 'فئة ميني فان للعائلات والمجموعات من الوكيل لخدمات الليموزين',
  },
  'mini-van-premium': {
    key: 'mini_van_premium',
    slug: 'mini-van-premium',
    path: '/services/mini-van-premium',
    nameAr: 'ميني فان بريميوم',
    nameEn: 'Premium Mini Van',
    seoTitle: 'ليموزين ميني فان بريميوم حتى 4 ركاب | الوكيل',
    metaDescription:
      'ليموزين ميني فان بريميوم من الإسكندرية للرحلات الخاصة حتى 4 ركاب و5 حقائب. أرسل تفاصيل المسار والموعد لمراجعة السعر قبل تأكيد الحجز.',
    ogTitle: 'ميني فان بريميوم لضيافة خاصة | Al Wakeel Limousine',
    ogDescription:
      'مقصورة ضيافة مستقلة بمساحة أوسع حتى 4 ركاب و5 حقائب كحد أقصى، مع تحديد السعر بعد مراجعة تفاصيل الرحلة.',
    ogImagePath: '/og/mini-van-premium.jpg',
    ogImageAltAr: 'فئة ميني فان بريميوم الفاخرة من الوكيل لخدمات الليموزين',
  },
};

export const CATEGORY_KEY_TO_SLUG: Record<ServiceCategoryKey, ServiceCategorySlug> = {
  sedan_comfort: 'sedan-comfort',
  suv_premium: 'premium',
  mini_van: 'mini-van',
  mini_van_premium: 'mini-van-premium',
};

export const ALL_SERVICE_SLUGS: ServiceCategorySlug[] = [
  'sedan-comfort',
  'premium',
  'mini-van',
  'mini-van-premium',
];

export function isServiceCategorySlug(value: string | null | undefined): value is ServiceCategorySlug {
  if (!value) return false;
  return Object.prototype.hasOwnProperty.call(SERVICE_SEO_CATALOG, value);
}

export function getServiceSeoByCategoryKey(key: ServiceCategoryKey): ServiceSeoEntry {
  return SERVICE_SEO_CATALOG[CATEGORY_KEY_TO_SLUG[key]];
}

export function getServiceCategoryPath(slugOrKey: ServiceCategorySlug | ServiceCategoryKey): string {
  const slug = isServiceCategorySlug(slugOrKey)
    ? slugOrKey
    : CATEGORY_KEY_TO_SLUG[slugOrKey];
  return SERVICE_SEO_CATALOG[slug].path;
}

export function parseServiceSlugFromLocation(
  pathname: string,
  search: string = '',
  hash: string = ''
): ServiceCategorySlug | null {
  const cleanPath = pathname.replace(/\/+$/, '');
  const match = cleanPath.match(/^\/services\/([a-z0-9-]+)$/i);
  if (match && isServiceCategorySlug(match[1].toLowerCase())) {
    return match[1].toLowerCase() as ServiceCategorySlug;
  }

  if (hash) {
    const hashMatch = hash.replace(/^#/, '').replace(/\/+$/, '').match(/^\/services\/([a-z0-9-]+)$/i);
    if (hashMatch && isServiceCategorySlug(hashMatch[1].toLowerCase())) {
      return hashMatch[1].toLowerCase() as ServiceCategorySlug;
    }
  }

  if (search) {
    const params = new URLSearchParams(search);
    const paramCat = (params.get('category') || params.get('service') || '').trim().toLowerCase();
    if (isServiceCategorySlug(paramCat)) {
      return paramCat;
    }
  }

  return null;
}

export function buildHomeSchemaGraph(siteOriginInput?: string | null): Record<string, unknown> {
  const origin = resolveSiteOrigin(siteOriginInput);
  const businessId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': businessId,
        name: 'Al Wakeel Limousine | الوكيل لخدمات الليموزين',
        url: `${origin}/`,
        image: `${origin}${HOME_SEO.ogImagePath}`,
        description:
          'خدمات ليموزين وتنقل خاص تنفيذي من الإسكندرية إلى مطار برج العرب ومطار القاهرة ومطار سفنكس والساحل الشمالي.',
        telephone: '+201000053774',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'أبراج قمراية – رشدي – طريق الجيش',
          addressLocality: 'الإسكندرية',
          addressCountry: 'EG',
        },
        areaServed: [
          { '@type': 'City', name: 'الإسكندرية' },
          { '@type': 'Airport', name: 'مطار برج العرب الدولي' },
          { '@type': 'Airport', name: 'مطار القاهرة الدولي' },
          { '@type': 'Airport', name: 'مطار سفنكس الدولي' },
          { '@type': 'Place', name: 'الساحل الشمالي' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'فئات خدمة الليموزين والنقل الخاص',
          itemListElement: ALL_SERVICE_SLUGS.map((slug) => {
            const entry = SERVICE_SEO_CATALOG[slug];
            return {
              '@type': 'Service',
              name: `فئة ${entry.nameAr}`,
              alternateName: entry.nameEn,
              serviceType: 'Private Limousine & Chauffeur Transfer',
              description: entry.metaDescription,
              url: `${origin}${entry.path}`,
              provider: { '@id': businessId },
            };
          }),
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${origin}/`,
        name: 'Al Wakeel Limousine',
        inLanguage: 'ar-EG',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}/#webpage`,
        url: `${origin}/`,
        name: HOME_SEO.title,
        description: HOME_SEO.metaDescription,
        inLanguage: 'ar-EG',
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
      },
    ],
  };
}

export function buildServiceCategorySchemaGraph(
  slug: ServiceCategorySlug,
  siteOriginInput?: string | null
): Record<string, unknown> {
  const origin = resolveSiteOrigin(siteOriginInput);
  const entry = SERVICE_SEO_CATALOG[slug];
  const pageUrl = `${origin}${entry.path}`;
  const businessId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;

  const serviceNode: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: `خدمة ليموزين فئة ${entry.nameAr}`,
    alternateName: entry.nameEn,
    serviceType: 'Private Limousine & Chauffeur Transfer',
    category: entry.nameEn,
    description: entry.metaDescription,
    url: pageUrl,
    image: `${origin}${entry.ogImagePath}`,
    provider: { '@id': businessId },
    areaServed: ['الإسكندرية', 'مطار برج العرب الدولي', 'مطار القاهرة الدولي', 'مطار سفنكس الدولي', 'الساحل الشمالي'],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': businessId,
        name: 'Al Wakeel Limousine | الوكيل لخدمات الليموزين',
        url: `${origin}/`,
        telephone: '+201000053774',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'أبراج قمراية – رشدي – طريق الجيش',
          addressLocality: 'الإسكندرية',
          addressCountry: 'EG',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${origin}/`,
        name: 'Al Wakeel Limousine',
        inLanguage: 'ar-EG',
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: entry.seoTitle,
        description: entry.metaDescription,
        inLanguage: 'ar-EG',
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': `${pageUrl}#service` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: `${origin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `فئة ${entry.nameAr}`,
            item: pageUrl,
          },
        ],
      },
      serviceNode,
    ],
  };
}
