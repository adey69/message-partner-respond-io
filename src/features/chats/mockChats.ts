/** Stand-in data for building the chats list before the query layer exists. */

export type ChatSummary = {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
};

const MINUTE = 60_000;

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * MINUTE).toISOString();

export const mockChats: ChatSummary[] = [
  {
    id: 1,
    name: 'Marcus Bell',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Sounds good, see you then',
    lastMessageAt: minutesAgo(3),
  },
  {
    id: 2,
    name: 'Priya Raghunathan-Whitfield',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    lastMessage:
      'I went through the whole deck last night and left comments on the slides that still need numbers before Thursday',
    lastMessageAt: minutesAgo(24),
  },
  {
    id: 3,
    name: 'Dan',
    avatarUrl: 'https://i.pravatar.cc/150?img=59',
    lastMessage: 'ok',
    lastMessageAt: minutesAgo(51),
  },
  {
    id: 4,
    name: 'Aisha Okonkwo',
    avatarUrl: 'https://i.pravatar.cc/150?img=45',
    lastMessage: 'Can you send the address again?',
    lastMessageAt: minutesAgo(140),
  },
  {
    id: 5,
    name: 'Tomás Herrera',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    lastMessage: 'Booked it for eight, table by the window',
    lastMessageAt: minutesAgo(320),
  },
  {
    id: 6,
    name: 'Hannah Whitmore',
    avatarUrl: 'https://i.pravatar.cc/150?img=24',
    lastMessage: 'That is genuinely the funniest thing I have read all week',
    lastMessageAt: minutesAgo(600),
  },
  {
    id: 7,
    name: 'Kenji Nakamura',
    avatarUrl: '',
    lastMessage: 'Sent the invoice over this morning',
    lastMessageAt: minutesAgo(1_500),
  },
  {
    id: 8,
    name: 'Elena Vasquez',
    avatarUrl: 'https://i.pravatar.cc/150?img=16',
    lastMessage: 'Are we still on for Saturday?',
    lastMessageAt: minutesAgo(2_900),
  },
  {
    id: 9,
    name: 'Samuel Adeyemi',
    avatarUrl: 'https://i.pravatar.cc/150?img=52',
    lastMessage: 'No rush, whenever you get a chance',
    lastMessageAt: minutesAgo(4_300),
  },
  {
    id: 10,
    name: 'Freya Lindqvist',
    avatarUrl: 'https://i.pravatar.cc/150?img=41',
    lastMessage: 'Perfect, thank you!',
    lastMessageAt: minutesAgo(7_100),
  },
  {
    id: 11,
    name: 'Oliver Brennan',
    avatarUrl: 'https://i.pravatar.cc/150?img=61',
    lastMessage: 'Let me check with the team and get back to you',
    lastMessageAt: minutesAgo(13_000),
  },
  {
    id: 12,
    name: 'Mei Lin Chua',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'Congratulations, that is such good news',
    lastMessageAt: minutesAgo(20_000),
  },
];
