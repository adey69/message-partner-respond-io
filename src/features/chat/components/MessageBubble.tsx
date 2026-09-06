import { memo } from 'react';
import { Text, View } from 'react-native';
import { createMessageBubbleStyles } from './MessageBubble.styles';
import type { MessageDirection, MessageStatus } from '@/data/domain/message';
import { Avatar } from '@/shared/components/Avatar';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type MessageBubbleProps = {
  body: string;
  direction: MessageDirection;
  status?: MessageStatus;
  isGroupStart: boolean;
  isGroupEnd: boolean;
  contactName: string;
  contactAvatarUrl: string;
};

/** One message, with the contact's avatar shown against the last of their run. */
export const MessageBubble = memo(
  ({
    body,
    direction,
    status,
    isGroupStart,
    isGroupEnd,
    contactName,
    contactAvatarUrl,
  }: MessageBubbleProps) => {
    const styles = useThemedStyles(createMessageBubbleStyles);
    const isOutgoing = direction === 'outgoing';

    return (
      <View
        style={[
          styles.row,
          isGroupStart ? styles.newGroup : styles.sameGroup,
          isOutgoing ? styles.rowOutgoing : null,
        ]}
      >
        {isOutgoing ? null : isGroupEnd ? (
          <View style={styles.avatarSlot}>
            <Avatar name={contactName} uri={contactAvatarUrl} size="sm" />
          </View>
        ) : (
          <View style={styles.avatarSpacer} />
        )}
        <View style={[styles.column, isOutgoing ? styles.columnOutgoing : null]}>
          <View style={[styles.bubble, isOutgoing ? styles.bubbleOutgoing : null]}>
            <Text style={[styles.body, isOutgoing ? styles.bodyOutgoing : null]}>
              {body}
            </Text>
          </View>
          {status === 'pending' ? (
            <Text style={styles.pendingStatus}>Sending…</Text>
          ) : null}
          {status === 'failed' ? (
            <Text style={styles.failedStatus}>Not delivered</Text>
          ) : null}
        </View>
      </View>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';
