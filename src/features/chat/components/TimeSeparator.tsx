import { memo } from 'react';
import { Text } from 'react-native';
import { createTimeSeparatorStyles } from './TimeSeparator.styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type TimeSeparatorProps = {
  label: string;
};

export const TimeSeparator = memo(({ label }: TimeSeparatorProps) => {
  const styles = useThemedStyles(createTimeSeparatorStyles);

  return <Text style={styles.label}>{label}</Text>;
});

TimeSeparator.displayName = 'TimeSeparator';
