import { formatMessageSeparator } from './formatMessageSeparator';
import type { Message } from '@/data/domain/message';

const SEPARATOR_GAP = 60 * 60 * 1000;

export type ThreadItem = {
  message: Message;
  separatorLabel?: string;
  isGroupStart: boolean;
  isGroupEnd: boolean;
};

const separatorFor = (
  message: Message,
  needed: boolean,
): string | undefined => {
  if (!needed) {
    return undefined;
  }

  const label = formatMessageSeparator(message.sentAt);
  return label === '' ? undefined : label;
};

const isFarApart = (earlier: Message, later: Message) =>
  new Date(later.sentAt).getTime() - new Date(earlier.sentAt).getTime() >
  SEPARATOR_GAP;

/**
 * Groups a chronological thread by sender and returns it newest first, the
 * order an inverted list renders from the bottom of the screen upwards.
 */
export function buildThreadItems(messages: Message[]): ThreadItem[] {
  const needsSeparator = messages.map((message, index) => {
    const previous = messages[index - 1];
    return previous === undefined || isFarApart(previous, message);
  });

  const startsGroup = messages.map((message, index) => {
    const previous = messages[index - 1];
    return (
      needsSeparator[index] ||
      previous === undefined ||
      previous.direction !== message.direction
    );
  });

  return messages
    .map((message, index) => ({
      message,
      separatorLabel: separatorFor(message, needsSeparator[index]),
      isGroupStart: startsGroup[index],
      isGroupEnd: index === messages.length - 1 || startsGroup[index + 1],
    }))
    .reverse();
}
