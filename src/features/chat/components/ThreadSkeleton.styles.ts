import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

const BUBBLE_HEIGHT = 36;

export const createThreadSkeletonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: theme.spacing.sm,
    },
    row: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },
    rowOutgoing: {
      justifyContent: 'flex-end',
    },
    bubble: {
      height: BUBBLE_HEIGHT,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },
    bubbleSm: {
      width: '30%',
    },
    bubbleMd: {
      width: '50%',
    },
    bubbleLg: {
      width: '70%',
    },
  });
