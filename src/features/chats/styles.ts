import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    list: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingVertical: theme.spacing.sm,
    },
    emptyContent: {
      flexGrow: 1,
    },
    footer: {
      paddingVertical: theme.spacing.lg,
    },
  });
