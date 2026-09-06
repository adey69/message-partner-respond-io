import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { ChatListRow } from './components/ChatListRow';
import { CHAT_ROW_HEIGHT } from './components/ChatListRow.styles';
import { ChatListSkeleton } from './components/ChatListSkeleton';
import { createStyles } from './styles';
import { useChats, type ChatListItem } from './useChats';
import { StateMessage } from '@/shared/components/StateMessage';
import { useTheme } from '@/shared/theme/useTheme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const INITIAL_ROWS = 12;
const END_REACHED_THRESHOLD = 0.5;

const keyExtractor = (chat: ChatListItem) => String(chat.id);

const getItemLayout = (_: ArrayLike<ChatListItem> | null | undefined, index: number) => ({
  length: CHAT_ROW_HEIGHT,
  offset: CHAT_ROW_HEIGHT * index,
  index,
});

export function ChatsScreen() {
  const styles = useThemedStyles(createStyles);
  const theme = useTheme();
  const {
    chats,
    isPending,
    isError,
    isRefreshing,
    isFetchingNextPage,
    openChat,
    loadMore,
    refresh,
  } = useChats();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChatListItem>) => (
      <ChatListRow
        id={item.id}
        name={item.name}
        avatarUrl={item.avatarUrl}
        lastMessage={item.lastMessage}
        lastMessageAt={item.lastMessageAt}
        onPress={openChat}
      />
    ),
    [openChat],
  );

  const renderFooter = useCallback(
    () =>
      isFetchingNextPage ? (
        <View style={styles.footer}>
          <ActivityIndicator color={theme.colors.textMuted} />
        </View>
      ) : null,
    [isFetchingNextPage, styles, theme],
  );

  if (isPending) {
    return (
      <View style={styles.list}>
        <ChatListSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.list}>
        <StateMessage
          title="Could not load chats"
          message="Check your connection and try again."
          actionLabel="Try again"
          onAction={refresh}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_ROWS}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <StateMessage title="No chats yet" message="Conversations will appear here." />
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={theme.colors.textMuted}
          colors={[theme.colors.accent]}
        />
      }
      style={styles.list}
      contentContainerStyle={chats.length === 0 ? styles.emptyContent : styles.content}
    />
  );
}
