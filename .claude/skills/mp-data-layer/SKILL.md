---
name: mp-data-layer
description: Conventions for the MessagePartner data layer — React Query keys, cache policy, infinite queries, optimistic mutations, the outbox, and API-to-domain mapping. Use when adding or changing anything under src/data/, src/store/, or any feature hook that fetches or mutates.
---

# MessagePartner data layer

## The boundary

React Query owns server state. Zustand owns client state. Before adding state, ask which
one it is; if the answer is "both", it is server state with a client-side overlay, not a
reason to blur the line.

Currently in Zustand: message drafts. Nothing else.

## Query keys

All keys come from the factory in `src/data/query/keys.ts`. Never inline a key array at a
call site — that is how two callers end up with subtly different keys for the same data.

```ts
export const keys = {
  contacts: () => ['contacts'] as const,
  contact: (id: number) => ['contacts', id] as const,
  thread: (contactId: number) => ['thread', contactId] as const,
};
```

Keys are hierarchical so `invalidateQueries({ queryKey: keys.contacts() })` reaches the
list and every individual contact.

## Cache policy

Set defaults once in `src/data/query/queryClient.ts` rather than per-hook. Override at a
hook only with a comment saying why.

- `staleTime` is non-zero for this data. It is a static fixture; refetching it on every
  mount is wasted work and visible jank.
- `gcTime` stays above `staleTime`.
- `retry` is low. A failing fixture API will not succeed on the fourth attempt, and long
  retry chains make the error state feel broken.

React Query's `refetchOnWindowFocus` and `refetchOnReconnect` defaults are browser-shaped
and never fire on React Native unless wired. `src/data/query/rnFocus.ts` connects
`focusManager` to `AppState` and `onlineManager` to NetInfo. It is imported once at app
startup.

## Screen focus is not app focus

`focusManager` tracks the app moving between foreground and background. It has nothing to
do with React Navigation. Moving between screens or tabs does not change `AppState` and
does not trigger any refetch.

Screens also stay mounted across navigation — a tab screen stays mounted once visited, and
pushing a screen on top of another leaves the one underneath mounted. Returning to a screen
therefore reuses the existing query observer and its cached data. `staleTime` is the guard
if a screen ever does remount.

Do not add `useFocusEffect(refetch)` to a screen. This data is a static fixture, so a
refetch on every screen entry buys nothing, and refetching an infinite query refetches
**every page loaded so far** — five requests for a list scrolled five pages deep, with the
list shifting as they land.

Freshness comes from explicit pull-to-refresh on the chats list instead: user-initiated and
predictable, with no network traffic hidden behind navigation.

Pull-to-refresh trims the cached pages to the first and then refetches, rather than calling
`refetch()` on the full set:

```ts
queryClient.setQueryData<ContactsData>(keys.contacts(), current =>
  current === undefined
    ? current
    : { pages: current.pages.slice(0, 1), pageParams: current.pageParams.slice(0, 1) },
);
refetch();
```

Offset paging cannot safely re-page a list that has changed at its head — records inserted
at the top shift every later offset, so the replayed pages overlap and duplicate ids reach
`keyExtractor`. One fresh page is also what pulling down means, and the gesture only fires
at the top of the list, so nothing is lost by collapsing to it. Use `resetQueries` only
where a skeleton flash is acceptable; it clears the entry rather than trimming it.

## Infinite queries

Pagination is offset-based. Derive the next offset from what has already loaded and stop
by comparing against `total`:

```ts
getNextPageParam: (lastPage, allPages) => {
  const loaded = allPages.reduce((n, p) => n + p.results.length, 0);
  return loaded < lastPage.total ? loaded : undefined;
}
```

Returning `undefined` is what ends the scroll. A `page`-based implementation silently
loops the first page forever and looks like it works.

A thread uses the same recipe with a larger page size. A contact has at most a handful of
posts, so one request covers a whole thread and `getNextPageParam` returns `undefined`
straight away. The page size describes what a thread is worth fetching, not what this
fixture happens to hold — shrinking it until paging fires would be tuning the code to the
fixture.

A thread also has one source, because two endpoints merged into a single sorted stream
cannot be offset-paged: you would have to read both in full to know what the next page
contains.

## Mutations

Sending a message runs both layers, and both are load-bearing:

1. **Optimistic cache update.** `onMutate` cancels in-flight queries for the thread key,
   snapshots the previous value, writes the pending message, and returns the snapshot.
   `onError` restores it.
2. **Outbox persistence.** The same message is written to `src/store/outboxStore.ts`,
   keyed by contact id, and merged into the thread at render.

The second layer exists because the API discards writes, so a refetch or cache eviction
would otherwise delete the user's sent messages. Do not "simplify" it away, and do not
invalidate the thread query after a successful send.

Message status (`pending` / `sent` / `failed`) lives on the outbox entry and drives the
bubble's UI. Failed sends stay visible and retryable rather than disappearing.

## Domain mapping

Components never see an API shape. `src/data/domain/` converts `ApiUser` to `Contact` and
`ApiPost` to `Message`, and it is the only place that knows a message was ever a post. Adding a second source means a mapper and the thread hook, and touches no UI.

Mappers are pure and synchronous — no fetching, no store access.

## Adding an endpoint

1. Response type in `src/data/api/types.ts`.
2. URL builder in `src/data/api/endpoints.ts`, offset-based.
3. Mapper in `src/data/domain/` if it reaches the UI.
4. Key in the factory.
5. Hook in the owning feature's `hooks/` folder, not in `data/`.
