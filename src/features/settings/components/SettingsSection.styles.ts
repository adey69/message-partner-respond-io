import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createSettingsSectionStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.xl,
    },
    title: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.footnote,
      fontWeight: theme.fontWeight.semibold,
    },
    card: {
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    separator: {
      marginLeft: theme.spacing.lg,
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
    note: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.sm,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.caption,
    },
  });
