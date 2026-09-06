import { View } from 'react-native';
import { createChatListSkeletonStyles } from './ChatListSkeleton.styles';
import { Pulse } from '@/shared/components/Pulse';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const ROW_COUNT = 12;

const placeholderRows = Array.from({ length: ROW_COUNT }, (_, index) => index);

export function ChatListSkeleton() {
  const styles = useThemedStyles(createChatListSkeletonStyles);

  return (
    <Pulse>
      {placeholderRows.map(index => (
        <View key={index} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameBar} />
            <View style={styles.previewBar} />
          </View>
        </View>
      ))}
    </Pulse>
  );
}
