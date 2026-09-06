import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createAppToastStyles = (theme: Theme) =>
  StyleSheet.create({
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceMuted,
    },
    marker: {
      width: 3,
      alignSelf: 'stretch',
      marginRight: theme.spacing.md,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.danger,
    },
    label: {
      flexShrink: 1,
      color: theme.colors.text,
      fontSize: theme.fontSize.body,
    },
  });
