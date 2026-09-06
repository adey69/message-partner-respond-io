import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

const MIN_TOUCH_TARGET = 44;

export const createBlockedNoticeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    message: {
      flexShrink: 1,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.footnote,
    },
    action: {
      justifyContent: 'center',
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.sm,
    },
    actionPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    actionLabel: {
      color: theme.colors.accent,
      fontSize: theme.fontSize.footnote,
      fontWeight: theme.fontWeight.semibold,
    },
  });
