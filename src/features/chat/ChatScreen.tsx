import { Text, View } from 'react-native';
import { createStyles } from '@/features/chat/styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export function ChatScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chat</Text>
    </View>
  );
}
