import { memo, useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from 'react-native';
import { createChatListRowStyles } from './ChatListRow.styles';
import { useRelativeTime } from '../hooks/useRelativeTime';
import { Avatar } from '@/shared/components/Avatar';
import { useBlockStore } from '@/store/blockStore';
import { useDraftStore } from '@/store/draftStore';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const NO_MESSAGE_PREVIEW = 'Tap to open the conversation';
const BLOCKED_PREVIEW = 'This user is blocked.';

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
    const isBlocked = useBlockStore(state => state.blocked[id] === true);
    const draft = useDraftStore(state => state.drafts[id] ?? '');

    const hasDraft = !isBlocked && draft !== '';
    const showTimestamp = !isBlocked && !hasDraft;
    const timestamp = useRelativeTime(lastMessageAt, showTimestamp);

    let preview = lastMessage ?? NO_MESSAGE_PREVIEW;
    if (isBlocked) {
      preview = BLOCKED_PREVIEW;
    } else if (hasDraft) {
      preview = draft;
    }

    const handlePress = useCallback(
      () => onPress(id, name, avatarUrl),
      [onPress, id, name, avatarUrl],
    );

    const rowStyle = useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.row,
        pressed && styles.rowPressed,
        isBlocked && styles.rowBlocked,
      ],
      [styles, isBlocked],
    );

    return (
      <Pressable
        style={rowStyle}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Chat with ${name}`}
        accessibilityHint={hasDraft ? `Draft: ${draft}` : preview}
      >
        <Avatar name={name} uri={avatarUrl} size="md" />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.previewLine}>
            {hasDraft ? <Text style={styles.draftLabel}>Draft: </Text> : null}
            <Text
              style={[styles.preview, isBlocked && styles.previewBlocked]}
              numberOfLines={1}
            >
              {preview}
            </Text>
            {showTimestamp ? (
              <Text style={styles.timestamp}>{` · ${timestamp}`}</Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  },
);

ChatListRow.displayName = 'ChatListRow';
