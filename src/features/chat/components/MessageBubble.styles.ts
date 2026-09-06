import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createMessageBubbleStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: theme.spacing.lg,
    },
    rowOutgoing: {
      justifyContent: 'flex-end',
    },
    newGroup: {
      marginTop: theme.spacing.md,
    },
    sameGroup: {
      marginTop: theme.spacing.xs,
    },
    /* The width cap sits here because the row is the nearest parent with a
       resolved width; on the bubble itself the percentage has nothing to
       measure against and collapses to the widest word. */
    column: {
      maxWidth: '75%',
      alignItems: 'flex-start',
    },
    columnOutgoing: {
      alignItems: 'flex-end',
    },
    bubble: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },
    bubbleOutgoing: {
      backgroundColor: theme.colors.accent,
    },
    body: {
      color: theme.colors.text,
      fontSize: theme.fontSize.body,
    },
    bodyOutgoing: {
      color: theme.colors.textInverse,
    },
    avatarSlot: {
      marginRight: theme.spacing.sm,
    },
    avatarSpacer: {
      width: theme.avatarSize.sm,
      marginRight: theme.spacing.sm,
    },
    pendingStatus: {
      marginTop: theme.spacing.xs,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.caption,
    },
    failedStatus: {
      marginTop: theme.spacing.xs,
      color: theme.colors.danger,
      fontSize: theme.fontSize.caption,
    },
  });
