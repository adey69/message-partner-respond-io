import { Text, View } from 'react-native';
import type { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { createAppToastStyles } from './AppToast.styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const MAX_LINES = 2;

/**
 * A toast reports a failure that has nowhere else to go — one that happened
 * while the screen already had content worth keeping on it. It carries the same
 * tokens as the rest of the app rather than the library's own styling.
 */
function FailureToast({ text1 }: ToastConfigParams<unknown>) {
  const styles = useThemedStyles(createAppToastStyles);

  return (
    <View
      style={styles.toast}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.marker} />
      <Text style={styles.label} numberOfLines={MAX_LINES}>
        {text1}
      </Text>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  error: params => <FailureToast {...params} />,
};
