import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createChatHeaderTitleStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: theme.spacing.sm,
      borderRadius: theme.radius.pill,
    },
    containerPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    name: {
      marginLeft: theme.spacing.sm,
      color: theme.colors.text,
      fontSize: theme.fontSize.subtitle,
      fontWeight: theme.fontWeight.semibold,
    },
  });
