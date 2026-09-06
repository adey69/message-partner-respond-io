import { useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from 'react-native';
import { createBlockButtonStyles } from './BlockButton.styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type BlockButtonProps = {
  name: string;
  isBlocked: boolean;
  onToggle: () => void;
};

/**
 * Blocks or unblocks the contact. The note appears only while blocked, and
 * says what blocking does here rather than what it would do on a real network.
 */
export function BlockButton({ name, isBlocked, onToggle }: BlockButtonProps) {
  const styles = useThemedStyles(createBlockButtonStyles);

  const buttonStyle = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      styles.button,
      pressed && styles.buttonPressed,
    ],
    [styles],
  );

  const label = isBlocked ? 'Unblock' : 'Block';

  return (
    <View style={styles.container}>
      <Pressable
        style={buttonStyle}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${label} ${name}`}
      >
        <Text style={isBlocked ? styles.unblockLabel : styles.blockLabel}>
          {label}
        </Text>
      </Pressable>
      {isBlocked ? (
        <Text style={styles.note}>
          {`You blocked ${name}. You cannot send them messages until you unblock them.`}
        </Text>
      ) : null}
    </View>
  );
}
