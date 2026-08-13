# Frontend Architecture (C4)

This document describes the architecture of the Frui frontend at three levels of zoom, following the [C4 model](https://c4model.com/): System Context, Containers, and Components. This is a frontend-only repository — it renders the UI and calls a backend REST API, a GraphQL API, and Stripe, none of which live in this codebase.

---

## Level 1: System Context

Who uses Frui, and which outside systems it depends on. The frontend never talks to a database or holds payment card data directly — it calls two backend APIs and hands card entry off to Stripe's own SDK.

```mermaid
flowchart TB
    Traveler(["Traveler<br/>guest booking a stay"])
    SPA["Frui Frontend SPA<br/>React 19 + TS · Vite · this repo"]
    REST[("REST API<br/>auth · profile · chat · payment methods")]
    GQL[("GraphQL API<br/>stays · reviews · bookings · favorites")]
    Stripe[("Stripe<br/>hosted payment processing")]

    Traveler -- "uses, in browser (HTTPS)" --> SPA
    SPA -- "fetch() JSON" --> REST
    SPA -- "Apollo Client (GraphQL)" --> GQL
    SPA -- "Stripe.js SDK" --> Stripe
```

The traveler only ever talks to the SPA. The SPA fans out to three independent external systems — it holds no server-side logic, and no card data crosses through it (Stripe.js tokenizes in an iframe it controls).

---

## Level 2: Containers

Because this repo produces a single deployable artifact, the interesting boundary at this level is the browser itself: what runs inside it, what persists across reloads, and which outside service each piece calls.

```mermaid
flowchart LR
    subgraph Browser["Browser (client runtime)"]
        App["React SPA<br/>Vite build · code-split routes"]
        LS[("localStorage<br/>authToken (JWT)")]
        App <-- "persists / reads token" --> LS
    end

    REST[("REST API<br/>/api/v1")]
    GQL[("GraphQL API<br/>/graphql")]
    StripeAPI[("Stripe API")]

    App -- "REST fetch() JSON" --> REST
    App -- "Apollo Client" --> GQL
    App -- "Stripe.js SDK" --> StripeAPI
```

Everything inside the `Browser` boundary ships from this repo as one Vite bundle. State that must survive a reload (the auth token) lives in `localStorage`, not in Redux or Apollo's in-memory cache. It's read by both the Apollo `authLink` and `src/api/auth.ts`.

---

## Level 3: Components

Inside the SPA container: how a rendered page reaches down through feature components into the three ways this app gets or holds data — Redux for client-only UI state, Apollo for GraphQL data, and a thin REST client for the endpoints that have no GraphQL equivalent.

```mermaid
flowchart TB
    Router["App.tsx — Router shell<br/>BrowserRouter · lazy() routes · ErrorBoundary"]
    Pages["Pages — src/pages<br/>Home · StaysPage · StayInfoPage · Payment ·<br/>Profile (+tabs) · Login/Signup · Legal · NotFound"]
    Features["Feature Components<br/>SearchForm · BookingWidget · Chatbot ·<br/>Reviews · FilterBar · StayMap<br/>(Desktop/Mobile split)"]
    UI["UI Primitives — components/ui<br/>button · input · calendar · combobox · popover<br/>(shadcn-style, cva + tailwind-merge)"]
    Hooks["Hooks — src/hooks<br/>useIsMobile · useDebouncedValue ·<br/>useFavorites · useStaysFilter · useDestinations"]
    Redux["Redux Store — store/*<br/>search · filters · auth · booking · payment slices<br/>(browser-only state)"]
    Apollo["Apollo Client — lib/apolloClient.ts<br/>graphql/*.ts ops · authLink · cache policies"]
    RestClient["REST Client — src/api/*<br/>auth.ts · profile.ts · chat.ts"]
    StripeSdk["Stripe SDK — lib/stripe.ts<br/>loadStripe() singleton"]
    GQLAPI[("GraphQL API")]
    RESTAPI[("REST API")]
    StripeAPI[("Stripe API")]

    Router --> Pages
    Pages --> Features
    Pages --> UI
    Pages --> Hooks
    Features -- "built on" --> UI
    Features --> Redux
    Features --> Apollo
    Features --> RestClient
    Features --> StripeSdk

    Apollo -.-> GQLAPI
    RestClient -.-> RESTAPI
    StripeSdk -.-> StripeAPI
```

The desktop/mobile split described in `CLAUDE.md` happens inside the Feature Components layer, not shown per-component here. Pages don't call Apollo or Redux directly in most cases — they compose feature components that own that wiring.

### Key files

| Concern        | Files                                                      |
| -------------- | ---------------------------------------------------------- |
| Routing        | `src/App.tsx`, `src/main.tsx`                              |
| GraphQL data   | `src/graphql/*.ts`, `src/lib/apolloClient.ts`              |
| REST data      | `src/api/auth.ts`, `src/api/profile.ts`, `src/api/chat.ts` |
| Client state   | `src/store/*Slice.ts`, `src/store/hooks.ts`                |
| Payments       | `src/lib/stripe.ts`, `src/pages/Payment`                   |
| DTOs / mapping | `src/dtos/stayDTO`                                         |

---

_Reflects `project_lab_frontend` as of the current `main` branch. Backend REST and GraphQL services, and Stripe itself, are out of scope — this repo only contains the client shown above the Level 1 boundary._
