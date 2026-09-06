import { memo, useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { createAvatarStyles } from './Avatar.styles';
import type { AvatarSize } from '@/shared/theme/tokens';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type AvatarProps = {
  name: string;
  uri: string;
  size: AvatarSize;
};

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
}

export const Avatar = memo(({ name, uri, size }: AvatarProps) => {
  const styles = useThemedStyles(createAvatarStyles);
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);

  return (
    <View style={styles.circle[size]}>
      {uri !== '' && !failed ? (
        <Image
          source={{ uri }}
          style={styles.image}
          onError={handleError}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      ) : (
        <Text style={styles.initials[size]}>{initialsOf(name)}</Text>
      )}
    </View>
  );
});

Avatar.displayName = 'Avatar';
