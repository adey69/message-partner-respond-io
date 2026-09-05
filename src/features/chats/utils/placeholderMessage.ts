/**
 * The users endpoint carries no message history, so the chats list shows a
 * stand-in preview and time until a contact's thread is opened. Values are
 * derived from the contact id, so a row keeps the same placeholder for as long
 * as the app is running rather than changing under the reader.
 */

const MINUTE = 60_000;
const LOADED_AT = Date.now();

const PREVIEWS = [
  'Sounds good, see you then',
  'Thanks, that helps a lot',
  'Are we still on for later?',
  'Let me check and get back to you',
  'Just sent it over',
  'No rush, whenever you get a chance',
  'That works for me',
  'Talk soon',
];

const MINUTES_AGO = [3, 27, 58, 140, 320, 700, 1_500, 2_900, 4_300, 9_000, 16_000, 26_000];

export type PlaceholderMessage = {
  lastMessage: string;
  lastMessageAt: string;
};

export function placeholderMessage(contactId: number): PlaceholderMessage {
  const minutes = MINUTES_AGO[contactId % MINUTES_AGO.length];

  return {
    lastMessage: PREVIEWS[contactId % PREVIEWS.length],
    lastMessageAt: new Date(LOADED_AT - minutes * MINUTE).toISOString(),
  };
}
