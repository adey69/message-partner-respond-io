import { Text, View } from 'react-native';
import { createStyles } from '@/features/profile/styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export function ProfileScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Profile</Text>
    </View>
  );
}
