import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    thread: {
      flex: 1,
    },
    threadContent: {
      paddingVertical: theme.spacing.sm,
    },
    composerArea: {
      backgroundColor: theme.colors.background,
    },
  });
