# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is pnpm (husky hooks invoke `pnpm exec ...`).

- `pnpm dev` — start the Vite dev server (`--host`, so it's reachable on the LAN)
- `pnpm build` — typecheck (`tsc -b`) then build with Vite
- `pnpm lint` — run ESLint over the whole repo
- `pnpm test` — run Vitest in watch mode
- `pnpm test:run` — run Vitest once (CI mode)
- `pnpm test:run -- path/to/file.test.tsx` — run a single test file
- `pnpm test:run -- -t "test name"` — run tests matching a name pattern
- `pnpm codegen` — regenerate `src/types/__generated__/graphql.ts` from the GraphQL schema at `http://localhost:8080/graphql` (requires the backend running locally); config in `codegen.ts`

Commit messages are enforced by commitlint (`@commitlint/config-conventional`, i.e. Conventional Commits) via a `commit-msg` husky hook. A `pre-commit` hook runs `lint-staged` (ESLint --fix + Prettier on staged files).

## Architecture

This is a Vite + React 19 + TypeScript frontend for a travel booking site (stays, flights, cars, things to do, cruises). Routing is a flat `react-router-dom` `BrowserRouter` in `src/App.tsx` (`/`, `/stays`, `/login`, `/stay/:id`), wrapped in a persistent `Navbar` and `Footer`.

Two global providers wrap the app in `src/main.tsx`: Apollo (`src/lib/apolloClient.ts`, GraphQL endpoint from `src/config/api.ts`, `VITE_GRAPHQL_URL` env var) and Redux (`src/store/index.ts`). The GraphQL API is used for data fetching (stays, reviews — see `src/graphql/`); Redux (`@reduxjs/toolkit`) holds two slices, `search` and `filters` (`src/store/searchSlice.ts`, `src/store/filtersSlice.ts`), for cross-page UI/search state. Typed hooks live in `src/store/hooks.ts`.

GraphQL operations are defined in `src/graphql/*.ts`; `pnpm codegen` generates matching TypeScript types into `src/types/__generated__/graphql.ts` — do not hand-edit that file. Separate hand-written DTO types for stay data live in `src/dtos/stayDTO/`.

### Desktop/Mobile split

The dominant structural pattern in `src/components/` is a **separate component subtree per breakpoint** rather than one responsive component. Features that need different layouts on mobile vs. desktop are split into `Desktop/` and `Mobile/` subfolders with their own components, and sometimes their own local state/context (e.g. `SearchForm/Desktop/SearchFormContext.tsx` + `SearchFormProvider.tsx` vs. `SearchForm/Mobile/SearchFormMobileContext.tsx` + `useSearchFormMobileState.ts`). A top-level component (e.g. `SearchForm/SearchForm.tsx`) picks which subtree to render.

Two different mechanisms are used to decide which subtree is active, and they are not interchangeable:

- CSS breakpoints (`hidden md:block` / `md:hidden` at the 768px Tailwind `md` breakpoint) — used e.g. in `pages/Home.tsx` to switch between `Sections` and `MobileSections`. Both variants mount; CSS just hides one.
- The `useIsMobile()` hook (`src/hooks/useIsMobile.ts`, also keyed to a 768px threshold) — used e.g. in `SearchForm.tsx` to conditionally _mount_ only one variant (`if (isMobile) return <SearchFormMobile />; return <SearchFormDesktop />;`).

When adding a new responsive feature, follow the existing convention for that area of the codebase (check whether sibling components use the CSS-hide or the JS-hook approach) rather than mixing both within the same feature.

### UI primitives vs. feature components

`src/components/ui/` holds shadcn-style low-level primitives (button, input, popover, calendar, combobox, etc.) built on `class-variance-authority` + `tailwind-merge` (see `src/lib/utils.ts` for the `cn()` class-merging helper). Feature components under `src/components/*` compose these primitives; ESLint disables `react-refresh/only-export-components` specifically for `src/components/ui/**` since those files intentionally export helpers alongside components.

### Path alias

`@/*` resolves to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`). Prefer the alias over relative `../../` imports for anything outside the current feature folder.

### Testing

Vitest + React Testing Library, jsdom environment, global test APIs enabled (`vite.config.ts` `test` block). Setup file `src/test/setup.ts` only wires up `@testing-library/jest-dom` matchers — no other global mocks/fixtures exist yet.

## Code comments

Default to no comments. Well-named variables, functions, and components should make the code self-explanatory; do not add a comment that just restates what the next line does (`// Local state for X` above a `useState`, `// Header` above a header `<div>`, `// 1. Price filter` above a filter block, a JSDoc block above a component that just repeats its name and prop types).

Only write a comment when it captures something the code cannot: a workaround for a specific library/API bug or quirk, a non-obvious business rule or invariant, a hidden cross-file constraint, or a reason a simpler-looking alternative was rejected. Keep it to one or two lines. Never write multi-paragraph docstrings or numbered step-by-step comment blocks.

If you're touching a file with existing bloated/redundant comments, remove them as part of the change rather than leaving them.
