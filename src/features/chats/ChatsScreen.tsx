import { useCallback } from 'react';
import { FlatList, type ListRenderItemInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatListRow } from '@/features/chats/components/ChatListRow';
import { CHAT_ROW_HEIGHT } from '@/features/chats/components/ChatListRow.styles';
import { mockChats, type ChatSummary } from '@/features/chats/mockChats';
import { createStyles } from '@/features/chats/styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const INITIAL_ROWS = 12;

const keyExtractor = (chat: ChatSummary) => String(chat.id);

const getItemLayout = (
  _: ArrayLike<ChatSummary> | null | undefined,
  index: number,
) => ({
  length: CHAT_ROW_HEIGHT,
  offset: CHAT_ROW_HEIGHT * index,
  index,
});

export function ChatsScreen() {
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();

  const handlePressChat = useCallback(
    (contactId: number, contactName: string) => {
      navigation.navigate('Chat', { contactId, contactName });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChatSummary>) => (
      <ChatListRow
        id={item.id}
        name={item.name}
        avatarUrl={item.avatarUrl}
        lastMessage={item.lastMessage}
        lastMessageAt={item.lastMessageAt}
        onPress={handlePressChat}
      />
    ),
    [handlePressChat],
  );

  return (
    <FlatList
      data={mockChats}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_ROWS}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}
