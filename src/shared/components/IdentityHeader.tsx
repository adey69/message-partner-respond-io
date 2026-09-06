import { Text, View } from 'react-native';
import { createIdentityHeaderStyles } from './IdentityHeader.styles';
import { Avatar } from './Avatar';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type IdentityHeaderProps = {
  name: string;
  subtitle: string;
  avatarUrl: string;
};

/** Whoever a screen is about: large avatar, name, and one line beneath it. */
export function IdentityHeader({
  name,
  subtitle,
  avatarUrl,
}: IdentityHeaderProps) {
  const styles = useThemedStyles(createIdentityHeaderStyles);

  return (
    <View style={styles.container}>
      <Avatar name={name} uri={avatarUrl} size="lg" />
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      {subtitle === '' ? null : (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
