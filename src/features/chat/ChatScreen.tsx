import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlockedNotice } from './components/BlockedNotice';
import { Composer } from './components/Composer';
import { MessageBubble } from './components/MessageBubble';
import { ThreadSkeleton } from './components/ThreadSkeleton';
import { TimeSeparator } from './components/TimeSeparator';
import { createStyles } from './styles';
import { useChat } from './useChat';
import type { ThreadItem } from './utils/buildThreadItems';
import type { RootStackParamList } from '@/navigation/types';
import { StateMessage } from '@/shared/components/StateMessage';
import { useTheme } from '@/shared/theme/useTheme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const INITIAL_MESSAGES = 15;
const END_REACHED_THRESHOLD = 0.5;

const keyExtractor = (item: ThreadItem) => item.message.id;

export function ChatScreen() {
  const styles = useThemedStyles(createStyles);
  const theme = useTheme();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  const headerHeight = useHeaderHeight();
  const {
    items,
    isBlocked,
    isPending,
    isError,
    isLoadingMore,
    loadMore,
    retry,
    sendMessage,
    retryMessage,
  } = useChat(params.contactId);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ThreadItem>) => (
      <View>
        {item.separatorLabel === undefined ? null : (
          <TimeSeparator label={item.separatorLabel} />
        )}
        <MessageBubble
          id={item.message.id}
          body={item.message.body}
          direction={item.message.direction}
          status={item.message.status}
          isGroupStart={item.isGroupStart}
          isGroupEnd={item.isGroupEnd}
          contactName={params.contactName}
          contactAvatarUrl={params.contactAvatarUrl}
          onRetry={retryMessage}
        />
      </View>
    ),
    [params.contactName, params.contactAvatarUrl, retryMessage],
  );

  const renderMoreIndicator = useCallback(
    () =>
      isLoadingMore ? (
        <View style={styles.moreIndicator}>
          <ActivityIndicator color={theme.colors.textMuted} />
        </View>
      ) : null,
    [isLoadingMore, styles, theme],
  );

  const renderThread = () => {
    if (isPending) {
      return <ThreadSkeleton />;
    }

    if (isError && items.length === 0) {
      return (
        <StateMessage
          title="Could not load messages"
          message="Check your connection and try again."
          actionLabel="Try again"
          onAction={retry}
        />
      );
    }

    if (items.length === 0) {
      return (
        <StateMessage
          title="No messages yet"
          message={`Say hello to ${params.contactName}.`}
        />
      );
    }

    return (
      <FlatList
        inverted
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={INITIAL_MESSAGES}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        onEndReached={loadMore}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        ListFooterComponent={renderMoreIndicator}
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      {renderThread()}
      <SafeAreaView edges={['bottom']} style={styles.composerArea}>
        {isBlocked ? (
          <BlockedNotice
            contactId={params.contactId}
            name={params.contactName}
          />
        ) : (
          <Composer contactId={params.contactId} onSend={sendMessage} />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
