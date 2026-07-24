import '@testing-library/jest-dom';

// jsdom has no layout engine and doesn't implement ResizeObserver.
// @tanstack/react-virtual (used for the infinite-scroll stays grid) checks
// for it before using it and no-ops otherwise, but tests still exercise that
// check, so a no-op stand-in avoids relying on that fallback path silently.
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
}
