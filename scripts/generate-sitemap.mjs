#!/usr/bin/env node
// Regenerates dist/sitemap.xml and patches the `Sitemap:` line in
// dist/robots.txt with the real production URL. Runs as a `postbuild` step
// (see package.json) so it always operates on the freshly-built dist/.
//
// Static routes only for now: per-stay pages (/stay/:id) need the GraphQL
// API reachable from the build environment to list real ids, and CI
// (.github/workflows/deploy-frontend.yml) doesn't currently set
// VITE_GRAPHQL_URL or have confirmed network access to the backend at build
// time. Once that's wired up, extend this script to fetch stay ids (e.g. via
// GET_STAYS) and emit a <url> entry per stay, same as the static ones below.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

const PLACEHOLDER_SITE_URL = 'https://example.com';
const SITE_URL = (process.env.SITE_URL ?? PLACEHOLDER_SITE_URL).replace(
  /\/$/,
  '',
);

if (SITE_URL === PLACEHOLDER_SITE_URL) {
  console.warn(
    '[generate-sitemap] SITE_URL env var is not set — writing sitemap.xml ' +
      'and robots.txt with the placeholder domain. Set SITE_URL at deploy ' +
      'time to the real production domain before this is meaningful.',
  );
}

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/stays', changefreq: 'daily', priority: '0.9' },
  { path: '/pay-later', changefreq: 'monthly', priority: '0.3' },
  { path: '/booking-terms', changefreq: 'monthly', priority: '0.3' },
  { path: '/terms-of-service', changefreq: 'monthly', priority: '0.3' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
];

const lastmod = new Date().toISOString().slice(0, 10);

const urlEntries = staticRoutes
  .map(
    ({ path: routePath, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

if (!existsSync(distDir)) {
  console.error(
    '[generate-sitemap] dist/ does not exist — run `vite build` first.',
  );
  process.exit(1);
}

writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log(
  `[generate-sitemap] wrote dist/sitemap.xml with ${staticRoutes.length} routes (${SITE_URL}).`,
);

const robotsPath = path.join(distDir, 'robots.txt');
if (existsSync(robotsPath)) {
  const robotsTxt = readFileSync(robotsPath, 'utf-8');
  const patched = robotsTxt.replace(
    /^Sitemap:.*$/m,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  );
  writeFileSync(robotsPath, patched);
  console.log('[generate-sitemap] patched Sitemap: line in dist/robots.txt.');
}
