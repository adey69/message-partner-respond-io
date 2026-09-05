# MessagePartner

A React Native chat app: contacts list, message threads, contact profiles, settings.

## Architecture boundary

**React Query owns every piece of state that came from the server. Zustand owns every
piece of state that never leaves the device. Nothing crosses.**

The one deliberate exception is the outbox (`src/store/outboxStore.ts`), which holds
message-shaped data in client state. `POST /api/posts` returns 201 but discards the
write, so the server never echoes a sent message back and it has no server-state home.

## Structure

```
src/
├── data/         api/ (transport) · domain/ (API -> app mappers) · query/ (cache policy)
├── features/     chats/ · chat/ · profile/ · settings/  — one folder per screen
├── shared/       components/ · theme/ · utils/  — used by 2+ features, knows about none
├── store/        Zustand client state
├── navigation/   navigators + typed route params
└── assets/       icons/  — SVGs as the icon set exports them, compiled by Metro
```

A feature folder splits the screen three ways — `ChatScreen.tsx` (markup), `styles.ts`
(the themed `createStyles` factory) and `useChat.ts` (its logic) — with `hooks/` for the
data hooks it composes and `components/` for pieces only it uses. A component file is
capped at 250 lines. See the `mp-ui-conventions` skill.

`data/` and `store/` sit at the same level so the state boundary is visible in the tree.

## Conventions

**Comments are timeless and written for any reader.** Describe what the code does and why
it is this way. Never describe how it got that way — no "changed from X", no "this used to
break", no ticket numbers or personal shorthand. Keep the durable fact, cut the narrative:

```ts
// ✗  Initially used `page` but the API ignored it, so we switched to offset
// ✓  The API paginates by offset; a `page` param is accepted but ignored.
```

Git history holds the archaeology. Do not leave commented-out code.

**`DECISIONS.md` records only decisions embodied in the code.** Every entry must point at
something that exists. Rejected alternatives may appear as context inside a real entry,
never as an entry of their own.

**No barrel (`index.ts`) files.** Metro does not tree-shake by default, so barrels pull
every module in a directory into the graph and evaluate them at startup. Import files
directly; the `@/*` alias already keeps paths short.

**Inside a feature, imports are relative. Crossing out of one, they use `@/*`.** A screen
reaches its own pieces as `./styles`, `./components/ChatListRow`, `../utils/formatDate`,
and reaches `data/`, `shared/` and `navigation/` as `@/…`.

The feature folder is then self-contained — it can be renamed or moved without touching a
line inside it — and `@/` carries information: every one marks a dependency that leaves
the feature, so a screen's coupling to the rest of the app is visible in its import list.

**TypeScript is strict.** No `any`. API response types live in `src/data/api/types.ts` and
are converted by `src/data/domain/*` before reaching a component.

## API facts

Base URL `https://responserift.dev`. Endpoints: `users`, `posts`, `comments`, `todos`.

- List responses are `{ total, limit, offset, results }`.
- Pagination is `limit`/`offset` only. A `page` param is accepted and ignored.
- `POST /api/posts` returns 201 with a fabricated id and does not persist.
- A thread merges a contact's `posts` and `comments` (0–9 items per contact, 9 contacts
  have none) sorted by `createdAt`. Everything fetched is inbound; outbound comes from the
  outbox.
