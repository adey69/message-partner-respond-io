import { useCallback } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { createComposerStyles } from './Composer.styles';
import { useDraftStore } from '@/store/draftStore';
import { useTheme } from '@/shared/theme/useTheme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type ComposerProps = {
  contactId: number;
  onSend: (body: string) => void;
};

/**
 * The message input. The draft is read straight from the store so that only
 * this component and the contact's row in the chats list re-render as it is
 * typed, never the thread behind it.
 */
export function Composer({ contactId, onSend }: ComposerProps) {
  const styles = useThemedStyles(createComposerStyles);
  const theme = useTheme();
  const draft = useDraftStore(state => state.drafts[contactId] ?? '');
  const setDraft = useDraftStore(state => state.setDraft);

  const canSend = draft.trim().length > 0;

  const handleChangeText = useCallback(
    (body: string) => setDraft(contactId, body),
    [setDraft, contactId],
  );

  const handleSend = useCallback(() => {
    const body = draft.trim();
    if (body.length === 0) {
      return;
    }
    onSend(body);
    setDraft(contactId, '');
  }, [draft, onSend, setDraft, contactId]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={handleChangeText}
        placeholder="Message"
        placeholderTextColor={theme.colors.textMuted}
        multiline
        accessibilityLabel="Message"
      />
      <Pressable
        style={styles.send}
        onPress={handleSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        <Text style={canSend ? styles.sendLabel : styles.sendLabelDisabled}>
          Send
        </Text>
      </Pressable>
    </View>
  );
}
