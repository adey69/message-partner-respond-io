import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createStateMessageStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.fontSize.subtitle,
      fontWeight: theme.fontWeight.semibold,
      textAlign: 'center',
    },
    message: {
      marginTop: theme.spacing.sm,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.body,
      textAlign: 'center',
    },
    action: {
      marginTop: theme.spacing.lg,
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.accent,
    },
    actionPressed: {
      backgroundColor: theme.colors.accentPressed,
    },
    actionLabel: {
      color: theme.colors.textInverse,
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.semibold,
    },
  });
