/**
 * Every query key in the app. Keys are hierarchical, so invalidating
 * `contacts()` also reaches each individual `contact(id)`.
 */
export const keys = {
  contacts: () => ['contacts'] as const,
  contact: (id: number) => ['contacts', id] as const,
  thread: (contactId: number) => ['thread', contactId] as const,
};
