import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from '@/config/seo';

// Escape "<" so a value containing "</script>" (e.g. user-generated stay
// content) can't break out of the JSON-LD <script> tag it's embedded in.
function safeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Renders one or more schema.org JSON-LD blocks for structured data. */
export function JsonLd({ data }: JsonLdProps) {
  const entries = Array.isArray(data) ? data : [data];
  return (
    <>
      {entries.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(entry) }}
        />
      ))}
    </>
  );
}

interface SeoProps {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = '/favicon.png',
  type = 'website',
  noIndex = false,
  jsonLd,
}: SeoProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow'}
      />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && <JsonLd data={jsonLd} />}
    </>
  );
}
