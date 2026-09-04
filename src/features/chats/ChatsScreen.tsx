import { Text, View } from 'react-native';
import { createStyles } from '@/features/chats/styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export function ChatsScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chats</Text>
    </View>
  );
}
