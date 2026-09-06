# MessagePartner

A React Native chat app built against the ResponseRift fixture API: a contacts list
with infinite scroll, message threads with optimistic sending, contact profiles with a
global block toggle, and a settings screen.

## Screenshots

<!-- TODO: replace with real captures before submitting -->

| Chats | Thread | Profile | Settings |
| --- | --- | --- | --- |
| _screenshot_ | _screenshot_ | _screenshot_ | _screenshot_ |

## Getting started

Requires Node >= 22.11 and a working [React Native environment](https://reactnative.dev/docs/set-up-your-environment).

```sh
yarn install
cd ios && bundle exec pod install && cd ..   # iOS only
```

Run it:

```sh
yarn start          # Metro
yarn android
yarn ios
```

Checks:

```sh
yarn test
yarn lint
npx tsc --noEmit
```

### Release APK

```sh
cd android && ./gradlew assembleRelease
```

Gradle writes to `android/app/build/outputs/apk/release/app-release.apk`. That path sits
under a gitignored `build/` directory, so the committed copy lives at `dist/`:

```sh
mkdir -p dist
cp android/app/build/outputs/apk/release/app-release.apk dist/
```

Release builds are signed with the debug keystore the template ships with — enough to
install and run, not something that would go to a store.

## Architecture

The one rule the codebase is organised around:

> **React Query owns every piece of state that came from the server. Zustand owns every
> piece of state that never leaves the device. Nothing crosses.**

`data/` and `store/` sit at the same level in the tree so that boundary is visible in the
file layout rather than only in prose.

The deliberate exception is the **outbox**. `POST /api/posts` returns 201 and then
discards the write, so a sent message is never echoed back by the server and has no
server-state home. It lives in Zustand and is merged into the thread at render time, which
is also what lets it survive a refetch of the fetched half.

```
src/
├── data/         api/ (transport) · domain/ (API -> app mappers) · query/ (cache policy)
├── features/     chats/ · chat/ · profile/ · settings/  — one folder per screen
├── shared/       components/ · theme/ · utils/  — used by 2+ features, knows about none
├── store/        Zustand client state
├── navigation/   navigators + typed route params
└── assets/       icons/
```

Each feature folder splits its screen three ways — the markup, a themed `createStyles`
factory, and a hook holding its logic — with `hooks/` for data hooks it composes and
`components/` for pieces only it uses. Inside a feature, imports are relative; crossing
out of one, they use `@/*`. Every `@/` in a screen therefore marks a dependency that
leaves the feature, so its coupling to the rest of the app is readable from the import
list alone.

## Decisions worth calling out

**The sent message is not written to the query cache.** The thread query holds raw API
pages, so an optimistic entry there would mean fabricating a post — and because the API
discards writes, the next refetch would replace that page and the message would blink out.
Rolling back on error would be the same problem in reverse. Status (`pending` / `sent` /
`failed`) lives on the outbox entry and drives the bubble.

**The created post in the send response is discarded.** Every call answers with the same
fabricated id (`101`), so adopting it would give every sent message the same key.

**Pull-to-refresh trims the cached pages to the first, then refetches.** Calling
`refetch()` on an infinite query refetches *every* page loaded so far — five requests for
a list scrolled five pages deep, with the list shifting as they land. Offset paging also
cannot safely re-page a list that has changed at its head. One fresh page is what pulling
down means anyway, and the gesture only fires at the top.

**Client state is persisted; the query cache is not.** The outbox is the only copy of a
sent message that exists, so losing it on restart is losing user data. The React Query
cache is re-derivable from the network, and persisting it would put a stale fixture on
disk with no story for invalidating it.

**A send interrupted by process death is restored as `failed`, not `pending`.** Its
request died with the process and nothing is left to answer it, so restoring it as
`pending` would strand it showing "Sending…" forever with no retry affordance.

**No barrel (`index.ts`) files.** Metro does not tree-shake by default, so barrels pull
every module in a directory into the graph and evaluate them at startup.

**Relative timestamps are driven by a shared clock, not a per-row timer.** One interval
serves every visible row, and the store compares the rendered *label* rather than the
clock reading — so a row showing a calendar date never re-renders.

## Testing

Unit tests cover the pure logic (thread grouping, timestamp formatting, outbox
restoration), the Zustand stores, and the screens via React Native Testing Library, with
the network stubbed at `fetch`.

```sh
yarn test
```

## How AI tools were used

Claude Code typed most of the code in this repository. The engineering decisions it was
working within were mine, and most of them were made before the code existed.

**Decided and directed by me**

- **Architecture.** The state boundary above — React Query owns server state, Zustand
  owns device state, nothing crosses — along with the feature-folder layout, the
  relative-vs-`@/` import rule, and the no-barrels constraint.
- **State management.** Choosing Zustand, and designing the outbox as the answer to an
  API that accepts a write and then discards it.
- **Which requirements to satisfy, and how far.** Deciding what "infinite scroll" and
  "optimistic send" should mean against a static fixture, and where satisfying the
  letter of a requirement would have meant tuning the code to the test data instead.
- **Edge cases.** Working through what happens on process death mid-send, on a corrupt
  stored payload, on a render error in a release build, and on a refetch of a
  deep-scrolled infinite list — then deciding which were worth handling now and which
  belong under Known limitations.
- **UI.** Choosing to follow Messenger's visual language — bubble grouping, the avatar
  against the last message of a run, the inverted thread, time separators — and the
  token scale every screen is built from.
- **Review.** Reading each change before it landed, and cutting work that had not earned
  its complexity: a hand-rolled persistence layer was rejected in favour of Zustand's
  built-in `persist` middleware.

**Delegated to the tool**

- Typing out components, hooks, styles and tests against those constraints.
- Mechanical consistency — holding file structure, naming and comment style steady
  across features.
- Auditing finished code for problems, which I then triaged. The interrupted-send
  restore and the missing error boundary both came out of that.

The constraints were written down first — in `CLAUDE.md` and in project-specific skill
files under `.claude/skills/` — so generated code matched the project's conventions,
rather than the conventions being retrofitted to whatever was generated.

## Known limitations

Things deliberately left undone, and why:

- **The block toggle is local and cosmetic.** The API has no concept of blocking, so it
  hides the composer without affecting what the server returns.
- **Chat list previews are placeholders.** The users endpoint carries no message history,
  so a row shows a stand-in preview derived from the contact id until its thread is
  opened. They are stable per contact rather than random, but they are not real messages.
- **The outbox is uncapped.** It grows for the lifetime of the install. A production
  version would need an eviction policy; at fixture scale it does not.
- **Rate limiting (100 req/min) is not specifically handled.** A 429 surfaces as the same
  generic error state as any other failure.
- **No offline detection.** `focusManager` is bridged to `AppState`, but `onlineManager`
  is not bridged to NetInfo, so there is no automatic recovery on reconnect.
- **Offset pagination is not stable against a changing dataset.** Safe here because the
  fixture is static; a real API would want cursors.
- **Route params are typed but not validated at runtime.** Nothing reaches a screen
  except through the chats list, which builds its params from mapped contacts, so the
  types hold today. Adding deep links or notification taps would need a guard.
