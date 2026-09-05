import { StyleSheet } from 'react-native';
import { avatarSize, type Theme } from '@/shared/theme/tokens';
import { CHAT_ROW_HEIGHT } from './ChatListRow.styles';

const BAR_HEIGHT = 12;
const NAME_BAR_WIDTH = '45%';
const PREVIEW_BAR_WIDTH = '70%';

export const createChatListSkeletonStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      height: CHAT_ROW_HEIGHT,
      paddingHorizontal: theme.spacing.lg,
    },
    avatar: {
      width: avatarSize.md,
      height: avatarSize.md,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
    },
    content: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    nameBar: {
      width: NAME_BAR_WIDTH,
      height: BAR_HEIGHT,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.surface,
    },
    previewBar: {
      width: PREVIEW_BAR_WIDTH,
      height: BAR_HEIGHT,
      marginTop: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.surface,
    },
  });
