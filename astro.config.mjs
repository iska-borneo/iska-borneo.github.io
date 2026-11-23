
import { defineConfig, envField, fontProviders, memoryCache } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import pagefind from './integrations/pagefind.mjs';
import localized404 from './integrations/localized-404.mjs';
import { defaultLocale, locales } from './src/i18n/locales.mjs';
import { routes } from './src/config/nav.config.ts';

function fontsourceVariable({ name, pkg, cssVariable, weight, fallbacks }) {
  const dir = `./node_modules/@fontsource-variable/${pkg}`;
  const css = readFileSync(`${dir}/index.css`, 'utf8');
  const faces = [...css.matchAll(/url\(\.\/files\/([^)]+\.woff2)\)[\s\S]*?unicode-range:\s*([^;]+);/g)]
    .map(([, file, range]) => ({ file, range }))
    .sort((a, b) => Number(b.file.includes('-latin-wght')) - Number(a.file.includes('-latin-wght')));

  return {
    provider: fontProviders.local(),
    name,
    cssVariable,
    fallbacks,
    options: {
      variants: faces.map(({ file, range }) => ({
        src: [`${dir}/files/${file}`],
        weight,
        style: 'normal',
        unicodeRange: range.split(',').map((r) => r.trim()),
      })),
    },
  };
}

const searchPages = new Set(
  locales.map((locale) => {
    const slug = routes.search?.slugs?.[locale] ?? routes.search?.path ?? 'search';
    return locale === defaultLocale ? `/${slug}/` : `/${locale}/${slug}/`;
  }),
);

export default defineConfig({
  site: 'https://iska-borneo.github.io',
  output: 'static',

  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },

  session: false,
  compressHTML: true,

  env: {
    schema: {
      SITE_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      PUBLIC_GA_MEASUREMENT_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GTM_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      CONTACT_FORM_ENDPOINT: envField.string({ context: 'server', access: 'secret', optional: true }),
      NEWSLETTER_ENDPOINT: envField.string({ context: 'server', access: 'secret', optional: true }),
      NEWSLETTER_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_SITE_VERIFICATION: envField.string({ context: 'server', access: 'public', optional: true }),
      BING_SITE_VERIFICATION: envField.string({ context: 'server', access: 'public', optional: true }),
      PUBLIC_GOOGLE_MAPS_API_KEY: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
      PUBLIC_CONSENT_ENABLED: envField.boolean({ context: 'client', access: 'public', optional: true, default: false }),
      PUBLIC_PRIVACY_POLICY_URL: envField.string({ context: 'client', access: 'public', optional: true, default: '' }),
    },
  },

  fonts: [
    fontsourceVariable({ name: 'Manrope', pkg: 'manrope', cssVariable: '--font-manrope', weight: '200 800', fallbacks: ['sans-serif'] }),
    fontsourceVariable({ name: 'Outfit', pkg: 'outfit', cssVariable: '--font-outfit', weight: '100 900', fallbacks: ['sans-serif'] }),
    fontsourceVariable({ name: 'JetBrains Mono', pkg: 'jetbrains-mono', cssVariable: '--font-jetbrains-mono', weight: '100 800', fallbacks: ['monospace'] }),
  ],

  cache: {
    provider: memoryCache(),
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  image: {
    layout: 'constrained',
  },

  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !searchPages.has(new URL(page).pathname),
      ...(locales.length > 1
        ? { i18n: { defaultLocale, locales: Object.fromEntries(locales.map((l) => [l, l])) } }
        : {}),
    }),
    pagefind(),
    localized404(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  security: {
    checkOrigin: true,
    csp: {
      scriptDirective: {
        resources: ["'self'"],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
      directives: ["object-src 'none'", "base-uri 'self'", "form-action 'self'"],
    },
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});
