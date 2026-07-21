import path from 'path';
import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Preconnects to the GraphQL API origin so the connection (DNS + TCP + TLS)
// is warm before Apollo's first request fires, instead of paying for it
// on the critical path after the JS finishes loading.
function preconnectGraphqlOrigin(graphqlUrl: string): Plugin {
  const origin = new URL(graphqlUrl).origin;
  return {
    name: 'preconnect-graphql-origin',
    transformIndexHtml() {
      return [
        {
          tag: 'link',
          attrs: { rel: 'preconnect', href: origin, crossorigin: '' },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const graphqlUrl = env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql';

  return {
    plugins: [react(), tailwindcss(), preconnectGraphqlOrigin(graphqlUrl)],
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
