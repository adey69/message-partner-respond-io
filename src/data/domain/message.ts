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
