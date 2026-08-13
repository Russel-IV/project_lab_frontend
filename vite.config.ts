import path from 'path';
import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Preconnects to critical third-party origins (the GraphQL API, the stay/room
// image CDN) so the connection (DNS + TCP + TLS) is warm before the first
// request against them fires, instead of paying for it on the critical path
// after the JS finishes loading.
function preconnectOrigins(urls: string[]): Plugin {
  // Same-origin (relative) URLs are skipped: the page is already connected
  // to its own origin, and new URL() throws on a path with no base to
  // resolve against.
  const absoluteUrls = urls.filter((url) => /^https?:\/\//.test(url));
  const origins = [...new Set(absoluteUrls.map((url) => new URL(url).origin))];
  return {
    name: 'preconnect-origins',
    transformIndexHtml() {
      return origins.map((origin) => ({
        tag: 'link' as const,
        attrs: { rel: 'preconnect', href: origin, crossorigin: '' },
        injectTo: 'head-prepend' as const,
      }));
    },
  };
}

// Preloads the Montserrat Latin variable-font subset — the one actually used
// for this app's (English) UI — so it starts downloading in parallel with
// CSS parsing instead of only being discovered once the CSSOM resolves the
// @font-face rule inside it (currently the longest link in the network
// dependency chain). @fontsource-variable/montserrat ships several other
// unicode-range subsets (latin-ext, cyrillic, cyrillic-ext, vietnamese) that
// we don't want to preload, so this matches the built asset's filename
// precisely rather than any "montserrat-latin*" prefix. Only runs at build
// time (bundle is undefined during `vite dev`), which is fine since preload
// hints are a production-serving concern.
function preloadLatinFont(): Plugin {
  return {
    name: 'preload-latin-font',
    transformIndexHtml(_html, { bundle }) {
      if (!bundle) return [];
      const fontFile = Object.keys(bundle).find((fileName) => {
        const base = fileName.split('/').pop() ?? '';
        return /^montserrat-latin-wght-normal-[^./]+\.woff2$/.test(base);
      });
      if (!fontFile) return [];
      return [
        {
          tag: 'link' as const,
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `/${fontFile}`,
            crossorigin: '',
          },
          injectTo: 'head-prepend' as const,
        },
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const graphqlUrl = env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql';
  const imageCdnOrigin =
    env.VITE_IMAGE_CDN_ORIGIN ||
    'https://project-lab-spring-microservices.s3.us-east-2.amazonaws.com';

  return {
    plugins: [
      react(),
      tailwindcss(),
      preconnectOrigins([graphqlUrl, imageCdnOrigin]),
      preloadLatinFont(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          // Apollo's useQuery/useBackgroundQuery internals otherwise land in
          // a chunk only reachable via the lazy route chunks that use them
          // (e.g. StaysPage), so it loads sequentially after those chunks
          // instead of in parallel with the initial bundle. Since
          // ApolloProvider is already imported eagerly in main.tsx, grouping
          // the whole package here makes Vite modulepreload it alongside
          // the entry chunk instead of as a later hop.
          manualChunks(id) {
            if (id.includes('@apollo/client')) return 'apollo';
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
    server: {
      allowedHosts: ['.loca.lt', '.ngrok-free.app'],
    },
  };
});
