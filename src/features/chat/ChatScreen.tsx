import { useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Composer } from './components/Composer';
import { MessageBubble } from './components/MessageBubble';
import { TimeSeparator } from './components/TimeSeparator';
import { createStyles } from './styles';
import { useChat } from './useChat';
import type { ThreadItem } from './utils/buildThreadItems';
import type { RootStackParamList } from '@/navigation/types';
import { StateMessage } from '@/shared/components/StateMessage';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const INITIAL_MESSAGES = 15;

const keyExtractor = (item: ThreadItem) => item.message.id;

export function ChatScreen() {
  const styles = useThemedStyles(createStyles);
  const { params } = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  const headerHeight = useHeaderHeight();
  const { items, sendMessage } = useChat(params.contactId);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ThreadItem>) => (
      <View>
        {item.separatorLabel === undefined ? null : (
          <TimeSeparator label={item.separatorLabel} />
        )}
        <MessageBubble
          body={item.message.body}
          direction={item.message.direction}
          status={item.message.status}
          isGroupStart={item.isGroupStart}
          isGroupEnd={item.isGroupEnd}
          contactName={params.contactName}
          contactAvatarUrl={params.contactAvatarUrl}
        />
      </View>
    ),
    [params.contactName, params.contactAvatarUrl],
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      /* Android resizes the window itself through adjustResize. */
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      {items.length === 0 ? (
        <StateMessage
          title="No messages yet"
          message={`Say hello to ${params.contactName}.`}
        />
      ) : (
        <FlatList
          inverted
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={INITIAL_MESSAGES}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
        />
      )}
      <SafeAreaView edges={['bottom']} style={styles.composerArea}>
        <Composer contactId={params.contactId} onSend={sendMessage} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
