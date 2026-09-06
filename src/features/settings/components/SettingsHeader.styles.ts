import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createSettingsHeaderStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    name: {
      marginTop: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.fontSize.title,
      fontWeight: theme.fontWeight.bold,
      textAlign: 'center',
    },
    role: {
      marginTop: theme.spacing.xs,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.body,
      textAlign: 'center',
    },
  });
