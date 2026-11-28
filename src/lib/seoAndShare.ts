import {
  DEFAULT_PUBLIC_SITE_URL,
  HOME_SEO,
  SERVICE_SEO_CATALOG,
  ServiceCategorySlug,
  buildHomeSchemaGraph,
  buildServiceCategorySchemaGraph,
  getServiceCategoryPath,
} from '../data/seoCatalog';

function upsertMetaTag(
  attribute: 'name' | 'property',
  key: string,
  content: string
): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLdScript(payload: Record<string, unknown>): void {
  if (typeof document === 'undefined') return;
  let script = document.getElementById('al-wakeel-schema-ld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'al-wakeel-schema-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

export function getPublicShareUrl(slug: ServiceCategorySlug): string {
  const path = getServiceCategoryPath(slug);
  return `${DEFAULT_PUBLIC_SITE_URL}${path}`;
}

export function syncPageSeoAndSchema(activeSlug: ServiceCategorySlug | null): void {
  if (typeof document === 'undefined') return;

  // Keep canonical, social, and structured-data URLs anchored to the approved public domain,
  // including when the app is viewed on a temporary branch or pull-request preview.
  const origin = DEFAULT_PUBLIC_SITE_URL;

  if (!activeSlug) {
    const url = `${origin}/`;
    const ogImage = `${origin}${HOME_SEO.ogImagePath}`;

    document.title = HOME_SEO.title;
    upsertMetaTag('name', 'description', HOME_SEO.metaDescription);
    upsertCanonicalLink(url);

    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:locale', 'ar_EG');
    upsertMetaTag('property', 'og:site_name', 'Al Wakeel Limousine');
    upsertMetaTag('property', 'og:title', HOME_SEO.ogTitle);
    upsertMetaTag('property', 'og:description', HOME_SEO.ogDescription);
    upsertMetaTag('property', 'og:url', url);
    upsertMetaTag('property', 'og:image', ogImage);
    upsertMetaTag('property', 'og:image:alt', HOME_SEO.ogImageAltAr);

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', HOME_SEO.ogTitle);
    upsertMetaTag('name', 'twitter:description', HOME_SEO.ogDescription);
    upsertMetaTag('name', 'twitter:image', ogImage);

    upsertJsonLdScript(buildHomeSchemaGraph(origin));
    return;
  }

  const entry = SERVICE_SEO_CATALOG[activeSlug];
  const url = `${origin}${entry.path}`;
  const ogImage = `${origin}${entry.ogImagePath}`;

  document.title = entry.seoTitle;
  upsertMetaTag('name', 'description', entry.metaDescription);
  upsertCanonicalLink(url);

  upsertMetaTag('property', 'og:type', 'website');
  upsertMetaTag('property', 'og:locale', 'ar_EG');
  upsertMetaTag('property', 'og:site_name', 'Al Wakeel Limousine');
  upsertMetaTag('property', 'og:title', entry.ogTitle);
  upsertMetaTag('property', 'og:description', entry.ogDescription);
  upsertMetaTag('property', 'og:url', url);
  upsertMetaTag('property', 'og:image', ogImage);
  upsertMetaTag('property', 'og:image:alt', entry.ogImageAltAr);

  upsertMetaTag('name', 'twitter:card', 'summary_large_image');
  upsertMetaTag('name', 'twitter:title', entry.ogTitle);
  upsertMetaTag('name', 'twitter:description', entry.ogDescription);
  upsertMetaTag('name', 'twitter:image', ogImage);

  upsertJsonLdScript(buildServiceCategorySchemaGraph(activeSlug, origin));
}

export interface ShareResult {
  status: 'shared' | 'copied' | 'cancelled' | 'failed';
  url: string;
}

export async function shareServiceCategory(slug: ServiceCategorySlug): Promise<ShareResult> {
  const entry = SERVICE_SEO_CATALOG[slug];
  const shareUrl = getPublicShareUrl(slug);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: entry.ogTitle,
        text: entry.ogDescription,
        url: shareUrl,
      });
      return { status: 'shared', url: shareUrl };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { status: 'cancelled', url: shareUrl };
      }
      // Fall through cleanly to clipboard copy if share API is unsupported in current iframe/desktop context
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return { status: 'copied', url: shareUrl };
    }
  } catch {
    // Fall through to execCommand fallback
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (ok) {
      return { status: 'copied', url: shareUrl };
    }
  } catch {
    // Ignore copy error
  }

  return { status: 'failed', url: shareUrl };
}
