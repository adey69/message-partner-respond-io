---
name: mp-ui-conventions
description: Conventions for MessagePartner UI — design tokens, component structure, list performance, required loading/empty/error states, and when something is promoted into shared/. Use when creating or changing any component or screen.
---

# MessagePartner UI conventions

## Tokens only

Colours, spacing, radii, font sizes and weights come from `src/shared/theme/tokens.ts`.
No hex literals and no bare numbers in a `StyleSheet` outside that file. Spacing uses the
scale; if a value is not on the scale, either the scale is wrong or the design is.

Read tokens through `useTheme()` so light and dark resolve at render.

## Component structure

One component per file, named the same as the file. Order inside the file: imports, types,
component, `StyleSheet.create` at the bottom. Styles are always `StyleSheet.create`, never
inline object literals in JSX — inline objects allocate a new reference every render and
defeat memoization.

Feature components live in that feature's `components/` folder. A component moves to
`src/shared/components/` only when **two or more features already import it** and it
contains no feature-specific knowledge. One consumer means it stays where it is.

Shared components are presentational: props in, JSX out. No data fetching, no store
access. That is what keeps them safely memoizable and testable.

## Lists

The chats list and the thread are the two places performance is actually visible.

- Row components are wrapped in `React.memo` and receive primitive or stable props. A row
  taking a fresh object or arrow function every render is not memoized in practice.
- Callbacks passed into rows are `useCallback`-stable. Prefer passing an id and letting the
  row invoke `onPress(id)` over building a per-row closure.
- `keyExtractor` returns a stable domain id, never the array index.
- Fixed-height rows get `getItemLayout`, which removes measurement work and makes scroll
  position instant.
- Set `initialNumToRender` to roughly one screenful. The default renders more than is
  visible and slows first paint.
- Infinite scroll uses `onEndReachedThreshold` around 0.5, and the handler must no-op while
  `isFetchingNextPage` is true or it fires repeatedly during a single load.

## Every data view has three states

Any screen backed by a query renders a deliberate state for loading, empty and error. None
of them is a bare spinner on a white screen.

- **Loading** — skeleton rows matching the real row layout, so there is no layout shift
  when data lands.
- **Empty** — `EmptyState` with a specific message. Nine contacts genuinely have no
  messages, so the thread empty state is a real path, not a hypothetical one.
- **Error** — `ErrorState` with a retry that calls the query's `refetch`.

## Interaction

Every tappable element has a minimum 44x44 touch target, an `accessibilityRole`, and an
`accessibilityLabel` where the visible text is not self-explanatory. Avatars and icons
carry labels; decorative images are hidden from the accessibility tree.

Give tappable rows a pressed state. Silence on touch reads as a broken app.

## Text

Text that comes from the API is untrusted for length. Long names and long message bodies
must wrap or truncate with `numberOfLines`, never push layout sideways. Test with the
longest fixture value, not the shortest.
