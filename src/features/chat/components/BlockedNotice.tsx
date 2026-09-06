import { useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from 'react-native';
import { createBlockedNoticeStyles } from './BlockedNotice.styles';
import { useBlockStore } from '@/store/blockStore';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type BlockedNoticeProps = {
  contactId: number;
  name: string;
};

/** Stands in for the composer while the contact is blocked. */
export function BlockedNotice({ contactId, name }: BlockedNoticeProps) {
  const styles = useThemedStyles(createBlockedNoticeStyles);
  const toggleBlock = useBlockStore(state => state.toggleBlock);

  const handleUnblock = useCallback(
    () => toggleBlock(contactId),
    [toggleBlock, contactId],
  );

  const actionStyle = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      styles.action,
      pressed && styles.actionPressed,
    ],
    [styles],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.message} numberOfLines={2}>
        {`You blocked ${name}.`}
      </Text>
      <Pressable
        style={actionStyle}
        onPress={handleUnblock}
        accessibilityRole="button"
        accessibilityLabel={`Unblock ${name}`}
      >
        <Text style={styles.actionLabel}>Unblock</Text>
      </Pressable>
    </View>
  );
}
