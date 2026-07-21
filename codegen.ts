import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/graphql',
  // This assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  // useReviewSummaries.ts builds its query from a runtime template literal
  // (per-batch field aliases), which codegen's static document loader can't
  // parse — excluded so codegen can run against the rest of the app.
  documents: ['src/**/*.{ts,tsx}', '!src/hooks/useReviewSummaries.ts'],
  // Don't exit with non-zero status when there are no documents
  ignoreNoDocuments: true,
  generates: {
    // Use a path that works the best for the structure of your application
    './src/types/__generated__/graphql.ts': {
      plugins: ['typescript-operations'],
      config: {
        // Apollo Client always includes `__typename` fields
        nonOptionalTypename: true,
        // Apollo Client doesn't add the `__typename` field to root types so
        // don't generate a type for the `__typename` for root operation types.
        skipTypeNameForRoot: true,
        scalars: {
          BigDecimal: 'number',
        },
      },
    },
  },
};

export default config;
