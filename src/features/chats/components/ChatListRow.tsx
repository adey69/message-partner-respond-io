import { memo, useCallback } from 'react';
import { Pressable, Text, View, type PressableStateCallbackType } from 'react-native';
import { Avatar } from '@/features/chats/components/Avatar';
import { createChatListRowStyles } from '@/features/chats/components/ChatListRow.styles';
import { formatChatTimestamp } from '@/features/chats/utils/formatChatTimestamp';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type ChatListRowProps = {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  onPress: (id: number, name: string) => void;
};

/** One contact in the chats list, opening their thread when tapped. */
export const ChatListRow = memo(({
  id,
  name,
  avatarUrl,
  lastMessage,
  lastMessageAt,
  onPress,
}: ChatListRowProps) => {
  const styles = useThemedStyles(createChatListRowStyles);

  const handlePress = useCallback(() => onPress(id, name), [onPress, id, name]);

  const rowStyle = useCallback(
    ({ pressed }: PressableStateCallbackType) => (pressed ? styles.rowPressed : styles.row),
    [styles],
  );

  return (
    <Pressable
      style={rowStyle}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${name}`}
      accessibilityHint={lastMessage}>
      <Avatar name={name} uri={avatarUrl} size="md" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.previewLine}>
          <Text style={styles.preview} numberOfLines={1}>
            {lastMessage}
          </Text>
          <Text style={styles.timestamp}>{` · ${formatChatTimestamp(lastMessageAt)}`}</Text>
        </View>
      </View>
    </Pressable>
  );
});

ChatListRow.displayName = 'ChatListRow';
