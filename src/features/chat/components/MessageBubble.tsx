import { memo, useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from 'react-native';
import { createMessageBubbleStyles } from './MessageBubble.styles';
import RotateRight from '@/assets/icons/arrow-rotate-right-solid.svg';
import type { MessageDirection, MessageStatus } from '@/data/domain/message';
import { Avatar } from '@/shared/components/Avatar';
import { useTheme } from '@/shared/theme/useTheme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const RETRY_ICON_SIZE = 12;
const RETRY_HIT_SLOP = { top: 8, bottom: 8, left: 12, right: 12 };

type MessageBubbleProps = {
  id: string;
  body: string;
  direction: MessageDirection;
  status?: MessageStatus;
  isGroupStart: boolean;
  isGroupEnd: boolean;
  contactName: string;
  contactAvatarUrl: string;
  onRetry: (id: string) => void;
};

/** One message, with the contact's avatar shown against the last of their run. */
export const MessageBubble = memo(
  ({
    id,
    body,
    direction,
    status,
    isGroupStart,
    isGroupEnd,
    contactName,
    contactAvatarUrl,
    onRetry,
  }: MessageBubbleProps) => {
    const styles = useThemedStyles(createMessageBubbleStyles);
    const theme = useTheme();
    const isOutgoing = direction === 'outgoing';

    const handleRetry = useCallback(() => onRetry(id), [onRetry, id]);

    const retryStyle = useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.failedStatus,
        pressed && styles.failedStatusPressed,
      ],
      [styles],
    );

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
            <Pressable
              style={retryStyle}
              onPress={handleRetry}
              hitSlop={RETRY_HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Not delivered, tap to try again"
            >
              <RotateRight
                width={RETRY_ICON_SIZE}
                height={RETRY_ICON_SIZE}
                color={theme.colors.danger}
              />
              <Text style={styles.failedLabel}>Not delivered · Retry</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';
