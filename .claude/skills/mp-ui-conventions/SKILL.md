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

## Feature folder layout

A screen is three files, not one. Each has a single job, and each can be read without
scrolling past the other two.

```
features/chat/
├── ChatScreen.tsx      what is rendered
├── styles.ts           how it looks
├── useChat.ts          what it does
├── hooks/              data hooks the screen composes (useThread, useSendMessage)
└── components/         pieces used only by this screen
```

`styles.ts` exports `createStyles = (theme: Theme) => StyleSheet.create({...})` — a pure
function of the theme, defined at module scope. `useThemedStyles` keys its cache on that
function's identity, so a module-level factory is built once per theme rather than once
per component instance.

`use<Name>.ts` holds the screen's own logic and returns exactly what the JSX needs. The
screen file should read as markup plus the three render states, with no query plumbing or
derived-value arithmetic in it.

**Create these files when they have something in them.** A `useSettings()` that returns
an empty object is noise; extract the hook at the moment there is logic to extract. Styles
always exist, so `styles.ts` always does.

Screen components keep the `Screen` suffix. It marks a route component apart from the
ordinary components beside it in `components/`, and it makes the navigator's imports
unambiguous.

Components inside `components/` use `<Component>.styles.ts` rather than a bare
`styles.ts`, because that folder holds many components and a bare name would collide. A
feature folder holds exactly one screen, so `styles.ts` there is unambiguous.

## Component size

**250 lines is the ceiling for a component file**, and it counts only the component —
splitting styles and logic out is what buys the room, so the budget is for markup.

The number is a smell detector, not a target. A file crossing it is usually rendering two
things that want to be separate components, or holding logic that belongs in the hook. Fix
the cause: extract a subcomponent, or move the logic. Slicing a file in half to satisfy a
line count while the two halves stay coupled makes the code worse and the number better.

Under the ceiling and still hard to follow is also a failure. 250 lines is where a file
becomes indefensible, not where it becomes questionable.

## Component structure

One component per file, named the same as the file. Order inside the file: imports, types,
component. Styles are always `StyleSheet.create` via `styles.ts`, never inline object
literals in JSX — inline objects allocate a new reference every render and defeat
memoization.

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
