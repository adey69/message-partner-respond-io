import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

const MAX_INPUT_HEIGHT = 120;
const MIN_TOUCH_TARGET = 44;

export const createComposerStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },
    input: {
      flex: 1,
      maxHeight: MAX_INPUT_HEIGHT,
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontSize: theme.fontSize.body,
    },
    send: {
      minHeight: MIN_TOUCH_TARGET,
      justifyContent: 'center',
      paddingLeft: theme.spacing.md,
    },
    sendLabel: {
      color: theme.colors.accent,
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.semibold,
    },
    sendLabelDisabled: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.semibold,
    },
  });
