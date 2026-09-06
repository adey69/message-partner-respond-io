import { ScrollView, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { BlockButton } from './components/BlockButton';
import { ProfileSkeleton } from './components/ProfileSkeleton';
import { createStyles } from './styles';
import { useProfile } from './useProfile';
import type { RootStackParamList } from '@/navigation/types';
import { IdentityHeader } from '@/shared/components/IdentityHeader';
import { StateMessage } from '@/shared/components/StateMessage';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export function ProfileScreen() {
  const styles = useThemedStyles(createStyles);
  const { params } = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
  const { contact, isPending, isBlocked, toggleBlock, retry } = useProfile(
    params.contactId,
  );

  if (contact === undefined) {
    return (
      <View style={styles.screen}>
        {isPending ? (
          <ProfileSkeleton />
        ) : (
          <StateMessage
            title="Could not load profile"
            message="Check your connection and try again."
            actionLabel="Try again"
            onAction={retry}
          />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <IdentityHeader
        name={contact.name}
        subtitle={contact.phone}
        avatarUrl={contact.avatarUrl}
      />
      <BlockButton
        name={contact.name}
        isBlocked={isBlocked}
        onToggle={toggleBlock}
      />
    </ScrollView>
  );
}
