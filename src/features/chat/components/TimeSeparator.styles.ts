import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createTimeSeparatorStyles = (theme: Theme) =>
  StyleSheet.create({
    label: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xs,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.caption,
      fontWeight: theme.fontWeight.medium,
      textAlign: 'center',
    },
  });
