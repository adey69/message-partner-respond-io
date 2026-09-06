import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

const NAME_HEIGHT = 24;
const PHONE_HEIGHT = 16;
const BUTTON_HEIGHT = 44;

export const createProfileSkeletonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'stretch',
      paddingTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    avatar: {
      alignSelf: 'center',
      width: theme.avatarSize.lg,
      height: theme.avatarSize.lg,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
    },
    line: {
      alignSelf: 'center',
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.surface,
    },
    name: {
      width: '55%',
      height: NAME_HEIGHT,
      marginTop: theme.spacing.md,
    },
    phone: {
      width: '40%',
      height: PHONE_HEIGHT,
      marginTop: theme.spacing.sm,
    },
    button: {
      height: BUTTON_HEIGHT,
      marginTop: theme.spacing.xxl,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
  });
