import { memo, useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from 'react-native';
import { createSettingsRowStyles } from './SettingsRow.styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export type SettingsRowItem = {
  label: string;
  value: string;
  url?: string;
};

type SettingsRowProps = SettingsRowItem & {
  onOpen?: (url: string) => void;
};

/** A label and its value, tappable when the value points somewhere openable. */
export const SettingsRow = memo(
  ({ label, value, url, onOpen }: SettingsRowProps) => {
    const styles = useThemedStyles(createSettingsRowStyles);

    const handlePress = useCallback(() => {
      if (url !== undefined && onOpen !== undefined) {
        onOpen(url);
      }
    }, [url, onOpen]);

    const rowStyle = useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.row,
        pressed && styles.rowPressed,
      ],
      [styles],
    );

    const isLink = url !== undefined && onOpen !== undefined;

    const content = (
      <>
        <Text style={styles.label}>{label}</Text>
        <Text style={isLink ? styles.linkValue : styles.value} numberOfLines={1}>
          {value}
        </Text>
      </>
    );

    if (!isLink) {
      return <View style={styles.row}>{content}</View>;
    }

    return (
      <Pressable
        style={rowStyle}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${value}`}
      >
        {content}
      </Pressable>
    );
  },
);

SettingsRow.displayName = 'SettingsRow';
