import { Text, View } from 'react-native';
import { createStyles } from '@/features/settings/styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export function SettingsScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Settings</Text>
    </View>
  );
}
