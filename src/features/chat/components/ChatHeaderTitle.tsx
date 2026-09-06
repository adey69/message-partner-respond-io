import { useCallback } from 'react';
import { Pressable, Text, type PressableStateCallbackType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createChatHeaderTitleStyles } from './ChatHeaderTitle.styles';
import { Avatar } from '@/shared/components/Avatar';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type ChatHeaderTitleProps = {
  contactId: number;
  name: string;
  avatarUrl: string;
};

/** The contact a thread belongs to, opening their profile when tapped. */
export function ChatHeaderTitle({
  contactId,
  name,
  avatarUrl,
}: ChatHeaderTitleProps) {
  const styles = useThemedStyles(createChatHeaderTitleStyles);
  const navigation = useNavigation();

  const openProfile = useCallback(() => {
    navigation.navigate('Profile', { contactId });
  }, [navigation, contactId]);

  const containerStyle = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      styles.container,
      pressed && styles.containerPressed,
    ],
    [styles],
  );

  return (
    <Pressable
      style={containerStyle}
      onPress={openProfile}
      accessibilityRole="button"
      accessibilityLabel={`${name}, open profile`}
    >
      <Avatar name={name} uri={avatarUrl} size="sm" />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}
