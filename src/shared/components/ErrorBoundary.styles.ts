import { StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/tokens';

export const createErrorBoundaryStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
