import { Text, View } from 'react-native';
import { createSettingsHeaderStyles } from './SettingsHeader.styles';
import { Avatar } from '@/shared/components/Avatar';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type SettingsHeaderProps = {
  name: string;
  role: string;
  avatarUrl: string;
};

export function SettingsHeader({ name, role, avatarUrl }: SettingsHeaderProps) {
  const styles = useThemedStyles(createSettingsHeaderStyles);

  return (
    <View style={styles.container}>
      <Avatar name={name} uri={avatarUrl} size="lg" />
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      {role === '' ? null : (
        <Text style={styles.role} numberOfLines={1}>
          {role}
        </Text>
      )}
    </View>
  );
}
