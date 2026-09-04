import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.xl,
    },
    label: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.subtitle,
      fontWeight: theme.fontWeight.medium,
    },
  });
