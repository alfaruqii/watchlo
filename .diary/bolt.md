## 2026-10-21 - JS Map LRU Eviction & React Component Timeout Leaks

**Learning:**
1. In JavaScript `Map`, calling `map.set(key, value)` on an existing key updates the value but maintains the original insertion order position. Without explicit `map.delete(key)` prior to `map.set(...)`, eviction via `map.keys().next().value` evicts recently updated keys rather than true LRU entries.
2. Triggering delayed state updates (e.g. error messages or copied indicators) using `setTimeout` in React components without storing timer handles in `useRef` and clearing them on unmount leads to memory leaks and state updates on unmounted component trees.

**Action:**
1. Always `delete(key)` before `set(key, val)` in Map-based caches to ensure position refresh, and refresh position on `get()` hits.
2. Always capture `setTimeout` handles in `useRef` and attach an unmount `useEffect` cleanup hook for any delayed UI state resets.
