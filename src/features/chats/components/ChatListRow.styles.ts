import { StyleSheet } from 'react-native';
import { avatarSize, spacing, type Theme } from '@/shared/theme/tokens';

export const CHAT_ROW_HEIGHT = avatarSize.md + spacing.sm * 2;

export const createChatListRowStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      height: CHAT_ROW_HEIGHT,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    rowPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    content: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    name: {
      color: theme.colors.text,
      fontSize: theme.fontSize.subtitle,
      fontWeight: theme.fontWeight.medium,
    },
    previewLine: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    draftLabel: {
      color: theme.colors.accent,
      fontSize: theme.fontSize.body,
    },
    preview: {
      flexShrink: 1,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.body,
    },
    timestamp: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.body,
    },
  });
