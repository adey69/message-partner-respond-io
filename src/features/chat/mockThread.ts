import type { Message } from '@/data/domain/message';

/** Stand-in thread data for building the chat screen before the query layer exists. */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ago = (elapsed: number) => new Date(Date.now() - elapsed).toISOString();

const thread: Message[] = [
  {
    id: 'm1',
    body: 'Morning! Did you get a chance to look at the handover doc I sent over on Friday?',
    sentAt: ago(2 * DAY + 5 * HOUR),
    direction: 'incoming',
  },
  {
    id: 'm2',
    body: 'No rush, just wanted to make sure it landed',
    sentAt: ago(2 * DAY + 5 * HOUR + 20 * MINUTE),
    direction: 'incoming',
  },
  {
    id: 'm3',
    body: 'Got it, reading through it now',
    sentAt: ago(2 * DAY + 4 * HOUR),
    direction: 'outgoing',
    status: 'sent',
  },
  {
    id: 'm4',
    body: 'One thing I could not follow is the section on how the offsets are recalculated when a record is inserted at the head of the list. Could you walk me through that when you have a minute?',
    sentAt: ago(2 * DAY + 3 * HOUR),
    direction: 'outgoing',
    status: 'sent',
  },
  {
    id: 'm5',
    body: 'Sure. Easiest over a call, are you free tomorrow afternoon?',
    sentAt: ago(DAY + 6 * HOUR),
    direction: 'incoming',
  },
  {
    id: 'm6',
    body: 'Anything after two works',
    sentAt: ago(DAY + 6 * HOUR - 5 * MINUTE),
    direction: 'incoming',
  },
  {
    id: 'm7',
    body: 'Three suits me',
    sentAt: ago(DAY + 4 * HOUR),
    direction: 'outgoing',
    status: 'sent',
  },
  {
    id: 'm8',
    body: 'Perfect, I will send an invite',
    sentAt: ago(3 * HOUR),
    direction: 'incoming',
  },
  {
    id: 'm9',
    body: 'Thanks',
    sentAt: ago(4 * MINUTE),
    direction: 'outgoing',
    status: 'sent',
  },
  {
    id: 'm10',
    body: 'Also sending the updated diagram',
    sentAt: ago(2 * MINUTE),
    direction: 'outgoing',
    status: 'pending',
  },
  {
    id: 'm11',
    body: 'And the notes from last week',
    sentAt: ago(MINUTE),
    direction: 'outgoing',
    status: 'failed',
  },
];

const hasNoMessages = (contactId: number) => contactId % 5 === 0;

export function mockThread(contactId: number): Message[] {
  return hasNoMessages(contactId) ? [] : thread;
}
