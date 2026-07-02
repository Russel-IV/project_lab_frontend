# Fix Plan — code review findings (2026-07-02)

Source: full-repo review (no diff was available; branch was up to date with
`origin/main` and the working tree was clean). 10 findings, all
CONFIRMED by an independent verifier pass. Ordered by severity/priority.

## 1. App-crashing: invalid date strings crash rendering with no ErrorBoundary

**File:** `src/components/SearchForm/searchFormUtils.ts:34` (`formatDatesRange`)

`date-fns`'s `parse()` returns an `Invalid Date` object instead of throwing on
a malformed string, so `parseISOToDateRange`'s try/catch never fires.
`formatDatesRange`'s only guard is `!range.from`, which an `Invalid Date`
passes (it's truthy), so `format()` throws `RangeError: Invalid time value`
during render. No top-level `ErrorBoundary` wraps the routes.

**Fix:**

- In `formatDatesRange`, check `isValid(range.from)` / `isValid(range.to)`
  (date-fns `isValid`) before calling `format()`, falling back to `''`.
- Add a top-level `ErrorBoundary` in `App.tsx` (or `main.tsx`) around the
  routed content so any future render-time throw degrades gracefully instead
  of white-screening the app. `react-error-boundary` is already a dependency.

## 2. Dead filter: "Free cancellation" toggle has no effect

**File:** `src/pages/StaysPage.tsx:121` (`StaysListContent`), also
`StaysDetailContent` (~line 277)

`filtersSlice.freeCancellation` is dispatched and drives the button's active
style, but neither filter predicate reads it.

**Fix:** Destructure `freeCancellation` from `state.filters` in both
`StaysListContent` and `StaysDetailContent` and add a
`if (freeCancellation && !stay.freeCancellation) return false;`-style check
to both predicates (confirm the actual field name on the stay/GraphQL type).
Since this logic is duplicated between the two components (see item 10
below), fixing both copies now and extracting a shared filter function in
the same pass is worth doing together.

## 3. Date picker: selecting a new date after a complete range wipes both dates

**File:** `src/components/SearchForm/Desktop/SearchFormDatesField.tsx:42`
(`handleSelect`)

`isCompleteRange` is computed from the _previous_ `selectedRange`. When true,
the code calls `onDatesChange('', '')` unconditionally and never looks at
`newRange` — the user's actual click is discarded instead of becoming the new
check-in.

**Fix:** When `isCompleteRange` is true and the user clicks a new date,
treat it as starting a fresh range: call
`onDatesChange(format(newRange.from, 'yyyy-MM-dd'), '')` (mirroring the logic
already used in the mobile equivalent, `useSearchFormMobileState.handleSelectDates`)
instead of clearing both dates.

## 4. Silent state corruption: divide-by-zero in traveler parsing

**File:** `src/components/SearchForm/searchFormUtils.ts:60`
(`parseTravelersValue`)

A `roomCount` of 0 (reachable via a malformed `travelers` URL param) produces
`baseAdults = Infinity`, `remainder = NaN`, and an empty `configs` array with
no error.

**Fix:** Guard `roomCount` to a minimum of 1 before the division (e.g.
`const safeRoomCount = Math.max(1, roomCount);`), or fall back to the default
single-room config used elsewhere in the function when `roomCount <= 0`.

## 5. Stay detail page hangs forever on query error

**File:** `src/pages/StayInfoPage.tsx:43` (`GET_STAY_DETAILS` `useQuery`)

Only `data` is destructured; `error`/`loading` are ignored, so a failed
request leaves the page permanently on skeleton/empty placeholders with no
way for the user to know something went wrong.

**Fix:** Destructure `error` (and `loading` if not already tracked
separately) and render an error state, matching the pattern already used for
`GET_REVIEWS_BY_STAY` in the same file (`reviewsError` block around line
212).

## 6. Inconsistent NaN handling between the two queries on the stay detail page

**File:** `src/pages/StayInfoPage.tsx:46-51`

`GET_STAY_DETAILS` skips on `!id` (raw string truthiness) while
`GET_REVIEWS_BY_STAY` skips on `!stayId` (parsed-NaN falsiness). For a
non-numeric `id` param, the stay query fires with `NaN` as the GraphQL `Int`
variable while the reviews query silently skips and shows a misleading "no
reviews yet" message.

**Fix:** Compute `const stayId = id ? parseInt(id, 10) : NaN;` once, and use
`skip: Number.isNaN(stayId)` consistently for both queries (also fixes the
duplicate-parsing simplification noted in item 10).

## 7. Desktop search can be submitted with an incomplete date range

**File:** `src/components/SearchForm/Desktop/SearchFormProvider.tsx:29`
(`handleSearch`)

No validation that `checkInValue`/`checkOutValue`/`placeValue`/
`travelersValue` are non-empty or correctly ordered before navigating.

**Fix:** Add a guard at the top of `handleSearch` (or disable the submit
button via `FormSubmit`) that requires `checkInValue && checkOutValue &&
checkInValue <= checkOutValue` before calling `navigate`.

## 8. Mobile search can submit blank dates, overwriting valid state

**File:** `src/components/SearchForm/Mobile/useSearchFormMobileState.ts:172`
(`handleSearchSubmit`)

`handleClearAll` sets `localCheckIn`/`localCheckOut` to `''`; nothing stops
the user from tapping Search immediately after, dispatching empty dates to
Redux and navigating with blank URL params.

**Fix:** Same validation as item 7 — guard `handleSearchSubmit` on non-empty,
correctly-ordered dates (share a validation helper between the two if
practical, since this is the same defect class on the mobile path).

## 9. Unguarded numeric cast on a GraphQL scalar typed `unknown`

**File:** `src/components/StayCardVariant/StayCardVariant.tsx:163`, same
pattern in `src/components/ItemInfo/ItemInfo.tsx`

`codegen.ts` has no `scalars` mapping, so `starRating` (and similar numeric
fields) generate as `unknown`. The code force-casts with
`as number | null` and calls `.toFixed(1)` with no runtime check — if the
backend ever serializes this scalar as a string, every card crashes.

**Fix:** Add an explicit `scalars` mapping in `codegen.ts` for the backend's
numeric scalar (confirm with backend what it actually is — likely a
`BigDecimal`-style scalar) so the generated type reflects reality, and/or add
a runtime `typeof rating === 'number'` guard before calling `.toFixed()` in
both `StayCardVariant.tsx` and `ItemInfo.tsx`.

## 10. Price filter accepts an inverted min/max range with no feedback

**File:** `src/components/FilterBar/FilterModal.tsx:98` (`handleApply`)

No `min` attribute on the inputs and no `min <= max` validation anywhere
(`FilterModal`, `filtersSlice.setFilters`, or the `StaysPage` predicate), so
Minimum=1000/Maximum=10 silently produces zero results with a generic empty
state.

**Fix:** In `handleApply`, if both `draftPriceMin` and `draftPriceMax` are
set and `draftPriceMin > draftPriceMax`, either swap them or block apply and
show an inline validation message near the inputs.

---

## Not included above but worth a follow-up pass (cleanup, not correctness)

Cut from the top-10 list because correctness bugs took priority, but flagged
during review and still worth doing:

- **Duplicated stay-filtering logic** between `StaysListContent` and
  `StaysDetailContent` in `StaysPage.tsx` — extract into a shared
  `useFilteredStays(data, filters)` hook (do this alongside item 2 and 6
  above, since both touch this code).
- **`Sections`/`MobileSections` desktop/mobile tab desync**
  (`src/components/Sections/Sections.tsx`) — each holds independent
  `useState('stays')`; lift `activeTab` to a shared parent/hook so resizing
  across the `md` breakpoint doesn't silently revert the selection.
- **`SearchForm` flashes desktop layout on mobile's first render**
  (`src/components/SearchForm/SearchForm.tsx:147`) — `useIsMobile()` defaults
  to `false` until a post-mount effect corrects it; consider a lazy
  `useState(() => window.innerWidth < 768)` initializer to avoid the flash.
- **Stale mobile search-modal state** (`useSearchFormMobileState.ts:45`) —
  local draft state is seeded from Redux via `useState` initializers that
  never resync because `SearchFormMobile` stays mounted; add an effect that
  resyncs local state when `isOpen` transitions to `true`.
