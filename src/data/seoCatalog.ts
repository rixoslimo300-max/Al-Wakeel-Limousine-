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
  fixedOffers?: Array<{
    nameAr: string;
    priceEgp: number;
  }>;
}

export const DEFAULT_PUBLIC_SITE_URL = 'https://wakeellimousine.com';

export function resolveSiteOrigin(explicitOrigin?: string | null): string {
  const candidate = (explicitOrigin || '').trim().replace(/\/+$/, '');
  if (candidate && /^https?:\/\//i.test(candidate)) {
    return candidate;
  }
  return DEFAULT_PUBLIC_SITE_URL;
}

export const HOME_SEO = {
  title: 'Al Wakeel Limousine – الوكيل لخدمات الليموزين والنقل الفاخر',
  metaDescription:
    'الوكيل لخدمات الليموزين – خدمات تنقل خاصة من الإسكندرية إلى مطار برج العرب ومطار القاهرة ومطار سفنكس والساحل الشمالي بفئات خدمة تناسب احتياجك.',
  ogTitle: 'Al Wakeel Limousine – الوكيل لخدمات الليموزين والنقل الفاخر',
  ogDescription:
    'تنقل خاص بخصوصية كاملة من الإسكندرية إلى المطارات والمدن والوجهات السياحية. اختر فئة الخدمة المناسبة لرحلتك.',
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
    seoTitle: 'فئة سيدان مريحة | الوكيل لخدمات الليموزين',
    metaDescription:
      'خدمة ليموزين فئة سيدان مريحة للتنقل الخاص من الإسكندرية إلى المطارات والمدن حتى 3 ركاب وحقيبتين بخصوصية كاملة وأسعار ثابتة للمطارات.',
    ogTitle: 'فئة سيدان مريحة – تنقل خاص من Al Wakeel Limousine',
    ogDescription:
      'تجربة انتقال عملية وأنيقة بخصوصية كاملة لرحلات الأعمال والمطارات حتى 3 ركاب وحقيبتين مع انتظار مجاني في المطار.',
    ogImagePath: '/og/sedan-comfort.jpg',
    ogImageAltAr: 'فئة سيدان مريحة للتنقل الخاص من الوكيل لخدمات الليموزين',
    fixedOffers: [
      { nameAr: 'الإسكندرية ↔ مطار برج العرب الدولي (اتجاه واحد)', priceEgp: 850 },
      { nameAr: 'الإسكندرية ↔ مطار القاهرة الدولي (اتجاه واحد)', priceEgp: 1850 },
      { nameAr: 'الإسكندرية ↔ مطار سفنكس الدولي (اتجاه واحد)', priceEgp: 1850 },
    ],
  },
  premium: {
    key: 'suv_premium',
    slug: 'premium',
    path: '/services/premium',
    nameAr: 'بريميوم',
    nameEn: 'Premium',
    seoTitle: 'فئة بريميوم | الوكيل لخدمات الليموزين',
    metaDescription:
      'خدمة ليموزين فئة بريميوم لحضور تنفيذي وخصوصية أعلى ومساحة أرحب حتى 4 ركاب بالأمتعة أو 5–6 ركاب بدون حقائب في الإسكندرية والمطارات.',
    ogTitle: 'فئة بريميوم – مستوى أعلى من الخصوصية والراحة | Al Wakeel Limousine',
    ogDescription:
      'رحلة خاصة بمساحة أرحب وحضور راقٍ للمطارات والسفر بين المحافظات مع سائقين محترفين وأسعار واضحة.',
    ogImagePath: '/og/premium.jpg',
    ogImageAltAr: 'فئة بريميوم للتنقل التنفيذي الخاص من الوكيل لخدمات الليموزين',
    fixedOffers: [
      { nameAr: 'الإسكندرية ↔ مطار برج العرب الدولي (اتجاه واحد)', priceEgp: 1200 },
      { nameAr: 'الإسكندرية ↔ مطار القاهرة الدولي (اتجاه واحد)', priceEgp: 2200 },
      { nameAr: 'الإسكندرية ↔ مطار سفنكس الدولي (اتجاه واحد)', priceEgp: 2200 },
    ],
  },
  'mini-van': {
    key: 'mini_van',
    slug: 'mini-van',
    path: '/services/mini-van',
    nameAr: 'ميني فان',
    nameEn: 'Mini Van',
    seoTitle: 'فئة ميني فان | الوكيل لخدمات الليموزين',
    metaDescription:
      'خدمة ليموزين فئة ميني فان المصممة للعائلات والمجموعات والأمتعة الكبيرة حتى 10 ركاب أو 5 حقائب فأكثر من الإسكندرية إلى المطارات والمدن.',
    ogTitle: 'فئة ميني فان – رحابة للمجموعات والأمتعة | Al Wakeel Limousine',
    ogDescription:
      'تنقل عائلي وجماعي مريح دون قلق بشأن الحقائب أو عدد الركاب حتى 10 ركاب مع تكييف كامل وخصوصية تامة.',
    ogImagePath: '/og/mini-van.jpg',
    ogImageAltAr: 'فئة ميني فان للعائلات والمجموعات من الوكيل لخدمات الليموزين',
  },
  'mini-van-premium': {
    key: 'mini_van_premium',
    slug: 'mini-van-premium',
    path: '/services/mini-van-premium',
    nameAr: 'ميني فان بريميوم',
    nameEn: 'Premium Mini Van',
    seoTitle: 'فئة ميني فان بريميوم | الوكيل لخدمات الليموزين',
    metaDescription:
      'فئة ميني فان بريميوم من الوكيل لخدمات الليموزين: رحابة استثنائية ومستوى أعلى من الفخامة لرحلات حتى 4 ركاب و5 حقائب كحد أقصى.',
    ogTitle: 'فئة ميني فان بريميوم – رحابة وفخامة كبار الشخصيات | Al Wakeel Limousine',
    ogDescription:
      'تجربة انتقال راقية تجمع بين اتساع المقصورة وأعلى درجات الفخامة والراحة حتى 4 ركاب و5 حقائب كحد أقصى.',
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
        priceRange: '850 EGP - 3600 EGP',
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

  if (entry.fixedOffers && entry.fixedOffers.length > 0) {
    serviceNode.offers = entry.fixedOffers.map((offer) => ({
      '@type': 'Offer',
      name: `${entry.nameAr} — ${offer.nameAr}`,
      price: offer.priceEgp,
      priceCurrency: 'EGP',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    }));
  }

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
