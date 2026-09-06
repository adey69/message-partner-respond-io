import type { ApiPost } from '@/data/api/types';

export type MessageDirection = 'incoming' | 'outgoing';

export type MessageStatus = 'sent' | 'pending' | 'failed';

export type Message = {
  id: string;
  body: string;
  sentAt: string;
  direction: MessageDirection;
  /** Only outgoing messages carry one; everything fetched has already arrived. */
  status?: MessageStatus;
};

/**
 * A contact's posts are the app's inbound messages; only the body carries
 * over, since a bubble has nowhere to put a title, tags or a category. This is
 * the only place that knows a message was ever a post.
 */
export function toMessage(post: ApiPost): Message {
  return {
    id: `post-${post.id}`,
    body: post.body,
    sentAt: post.createdAt,
    direction: 'incoming',
  };
}
