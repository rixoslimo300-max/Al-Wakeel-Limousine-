import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import {
  ALL_SERVICE_SLUGS,
  SERVICE_SEO_CATALOG,
  ServiceCategorySlug,
  buildServiceCategorySchemaGraph,
  parseServiceSlugFromLocation,
  resolveSiteOrigin,
} from './src/data/seoCatalog.ts';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceTagAttr(
  html: string,
  pattern: RegExp,
  replacement: string
): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function injectServiceCategorySeoHtml(
  baseHtml: string,
  slug: ServiceCategorySlug,
  siteOrigin: string
): string {
  const entry = SERVICE_SEO_CATALOG[slug];
  const pageUrl = `${siteOrigin}${entry.path}`;
  const ogImageUrl = `${siteOrigin}${entry.ogImagePath}`;
  const schemaJson = JSON.stringify(
    buildServiceCategorySchemaGraph(slug, siteOrigin),
    null,
    2
  );

  let html = baseHtml;
  html = replaceTagAttr(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtmlAttr(entry.seoTitle)}</title>`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtmlAttr(entry.metaDescription)}" />`
  );
  html = replaceTagAttr(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtmlAttr(pageUrl)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtmlAttr(entry.ogTitle)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtmlAttr(entry.ogDescription)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtmlAttr(pageUrl)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtmlAttr(ogImageUrl)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:alt" content="${escapeHtmlAttr(entry.ogImageAltAr)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtmlAttr(entry.ogTitle)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtmlAttr(entry.ogDescription)}" />`
  );
  html = replaceTagAttr(
    html,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtmlAttr(ogImageUrl)}" />`
  );
  html = replaceTagAttr(
    html,
    /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i,
    `<script id="al-wakeel-schema-ld" type="application/ld+json">\n${schemaJson}\n    </script>`
  );

  return html;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteOrigin = resolveSiteOrigin(env.VITE_SITE_URL);

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: null,
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'robots.txt'],
        manifest: {
          id: '/',
          name: 'Al Wakeel Limousine | الوكيل لخدمات الليموزين',
          short_name: 'الوكيل',
          description: 'خدمات ليموزين ونقل فاخر في مصر – تنقل خاص من وإلى المطارات والوجهات السياحية.',
          theme_color: '#101D2D',
          background_color: '#101D2D',
          display: 'standalone',
          orientation: 'portrait',
          dir: 'rtl',
          lang: 'ar-EG',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
      // Dev + Static Prerender SEO plugin so direct URLs (/services/:slug)
      // serve exact category-specific <title>, OG tags, canonical URL, and JSON-LD
      // even for crawlers that do not execute JavaScript (WhatsApp / Facebook / Twitter / Google).
      {
        name: 'al-wakeel-static-route-seo',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const rawUrl = req.url || '/';
            const [pathnameOnly, queryOnly] = rawUrl.split('?');
            if (
              req.method !== 'GET' ||
              !pathnameOnly.startsWith('/services/') ||
              pathnameOnly.includes('.')
            ) {
              next();
              return;
            }
            const slug = parseServiceSlugFromLocation(
              pathnameOnly,
              queryOnly ? `?${queryOnly}` : ''
            );
            if (!slug) {
              next();
              return;
            }

            try {
              const templatePath = path.resolve(import.meta.dirname, 'index.html');
              const rawHtml = fs.readFileSync(templatePath, 'utf-8');
              const transformed = await server.transformIndexHtml(rawUrl, rawHtml);
              const reqOrigin = req.headers.host
                ? `http://${req.headers.host}`
                : siteOrigin;
              const finalHtml = injectServiceCategorySeoHtml(transformed, slug, reqOrigin);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(finalHtml);
            } catch (err) {
              next(err as Error);
            }
          });
        },
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(import.meta.dirname, 'dist');
          const baseIndexPath = path.resolve(distDir, 'index.html');
          if (!fs.existsSync(baseIndexPath)) {
            return;
          }
          const baseHtml = fs.readFileSync(baseIndexPath, 'utf-8');

          for (const slug of ALL_SERVICE_SLUGS) {
            const routeDir = path.resolve(distDir, 'services', slug);
            fs.mkdirSync(routeDir, { recursive: true });
            const prerenderedHtml = injectServiceCategorySeoHtml(
              baseHtml,
              slug,
              siteOrigin
            );
            fs.writeFileSync(
              path.resolve(routeDir, 'index.html'),
              prerenderedHtml,
              'utf-8'
            );
          }
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(import.meta.dirname, 'dist');
          const srcAssets = path.resolve(import.meta.dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
