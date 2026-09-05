---
name: mp-ui-conventions
description: Conventions for MessagePartner UI — the Messenger visual language it copies, design tokens, component structure, list performance, required loading/empty/error states, and when something is promoted into shared/. Use when creating or changing any component or screen.
---

# MessagePartner UI conventions

## Visual language

The app copies **Meta's Messenger**. The tokens in `tokens.ts` are Messenger's palette, and
the layouts below are Messenger's layouts. When a detail is unspecified here, the answer is
whatever Messenger does — not whatever iMessage or WhatsApp does. Those three look similar
enough that mixing them produces something that reads as "a chat app" rather than as a
deliberate design, which is the drift this section exists to stop.

**Copy only the parts the brief needs.** Messenger's surface is much larger than this app.
Deliberately absent, and to stay absent:

| Not building | Why |
|---|---|
| Search field above the list | Not in the brief, and there is no search endpoint — filtering only the pages already loaded behaves erratically next to infinite scroll |
| Active-now dots, stories row | No presence or story data exists; both would be decorating invented state |
| Unread badges and bold unread rows | The API has no read state, and faking one makes the list lie |
| Reactions, typing indicators, read receipts | No data, and each is a feature in its own right |
| Camera / compose FABs, attachment buttons | Nothing behind them to open |

Adding any of these means inventing data. A row that renders a green dot the API never
sent is worse than a row without one.

### Chats list row

Fixed **72pt** tall — 56pt avatar plus `spacing.sm` above and below — which is what makes
`getItemLayout` possible. `spacing.lg` horizontal padding, `spacing.md` between avatar and
text.

```
┌──────────────────────────────────────────┐
│  ●●●●   Marcus Bell                      │   subtitle / medium / text
│  ●●●●   Sounds good, see you then · 3m   │   body / regular / textMuted
└──────────────────────────────────────────┘
```

The timestamp sits **at the end of the preview line**, after a `·` separator, in the same
muted style as the preview. It is not a right-aligned column in the top corner — that is
WhatsApp's row, and it is the single easiest way to end up with the wrong app's list.

Both text lines are `numberOfLines={1}`. The preview flexes and truncates; the timestamp
never does.

**No dividers between rows.** Messenger separates rows with whitespace alone. Rows are
full-bleed — no cards, no insets, no shadows. The only hairline on the screen is the one
under the header.

### Avatars

Always circular (`radius.pill`), always from the `avatarSize` scale, never with a ring or
border. A missing or failed image falls back to a `surface` circle holding the contact's
initials in `textMuted` — never a broken-image box and never an empty hole.

### Message bubbles

| | Fill | Text | Side |
|---|---|---|---|
| Incoming | `surface` | `text` | left |
| Outgoing | `accent` | `textInverse` | right |

`radius.lg` corners, no tails. Max width 75% of the screen so a long message wraps rather
than spanning edge to edge. Padding is `spacing.md` horizontal, `spacing.sm` vertical.

Consecutive messages from the same sender are grouped: `spacing.xs` between bubbles inside
a group, `spacing.md` between groups. The avatar shows once per group, beside the last
bubble in it.

Outgoing bubbles come only from the outbox, so a pending or failed send is a state the
bubble itself has to show — an unsent bubble is not styled identically to a sent one.

### Composer

A `radius.pill` input filled with `surface`, sitting on `background` with a hairline above
it. The send control is `accent`, and is disabled — not hidden — while the input is empty.

### Chrome

Header and tab bar take `background`, divided from content by a `border` hairline. The tab
bar shows icon plus label, `accent` when focused and `textMuted` when not. The chat header
carries the contact's `avatarSize.sm` avatar next to their name, and tapping it opens the
profile.

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

Give tappable rows a pressed state — `surfaceMuted` fill, the way Messenger fills a row
under a finger. Silence on touch reads as a broken app.

## Text

Text that comes from the API is untrusted for length. Long names and long message bodies
must wrap or truncate with `numberOfLines`, never push layout sideways. Test with the
longest fixture value, not the shortest.
