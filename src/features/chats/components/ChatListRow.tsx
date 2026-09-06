import { memo, useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from 'react-native';
import { createChatListRowStyles } from './ChatListRow.styles';
import { formatChatTimestamp } from '../utils/formatChatTimestamp';
import { Avatar } from '@/shared/components/Avatar';
import { useDraftStore } from '@/store/draftStore';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const NO_MESSAGE_PREVIEW = 'Tap to open the conversation';

type ChatListRowProps = {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  onPress: (id: number, name: string, avatarUrl: string) => void;
};

/** One contact in the chats list, opening their thread when tapped. */
export const ChatListRow = memo(
  ({
    id,
    name,
    avatarUrl,
    lastMessage,
    lastMessageAt,
    onPress,
  }: ChatListRowProps) => {
    const styles = useThemedStyles(createChatListRowStyles);
    const draft = useDraftStore(state => state.drafts[id] ?? '');
    const hasDraft = draft !== '';

    const handlePress = useCallback(
      () => onPress(id, name, avatarUrl),
      [onPress, id, name, avatarUrl],
    );

    const rowStyle = useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.row,
        pressed && styles.rowPressed,
      ],
      [styles],
    );

    return (
      <Pressable
        style={rowStyle}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Chat with ${name}`}
        accessibilityHint={hasDraft ? `Draft: ${draft}` : lastMessage}
      >
        <Avatar name={name} uri={avatarUrl} size="md" />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.previewLine}>
            {hasDraft ? <Text style={styles.draftLabel}>Draft: </Text> : null}
            <Text style={styles.preview} numberOfLines={1}>
              {hasDraft ? draft : lastMessage ?? NO_MESSAGE_PREVIEW}
            </Text>
            {hasDraft || lastMessageAt === undefined ? null : (
              <Text style={styles.timestamp}>{` · ${formatChatTimestamp(
                lastMessageAt,
              )}`}</Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  },
);

ChatListRow.displayName = 'ChatListRow';
