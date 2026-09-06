import { useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from 'react-native';
import { createStateMessageStyles } from './StateMessage.styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type StateMessageProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StateMessage({
  title,
  message,
  actionLabel,
  onAction,
}: StateMessageProps) {
  const styles = useThemedStyles(createStateMessageStyles);

  const actionStyle = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      styles.action,
      pressed && styles.actionPressed,
    ],
    [styles],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel !== undefined && onAction !== undefined ? (
        <Pressable
          style={actionStyle}
          onPress={onAction}
          accessibilityRole="button"
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
