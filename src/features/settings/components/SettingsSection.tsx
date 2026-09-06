import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { SettingsRow, type SettingsRowItem } from './SettingsRow';
import { createSettingsSectionStyles } from './SettingsSection.styles';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type SettingsSectionProps = {
  title: string;
  rows: SettingsRowItem[];
  note?: string;
  onOpen?: (url: string) => void;
};

/** A titled group of rows in one card, with an optional note beneath it. */
export function SettingsSection({
  title,
  rows,
  note,
  onOpen,
}: SettingsSectionProps) {
  const styles = useThemedStyles(createSettingsSectionStyles);

  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>
        {rows.map((row, index) => (
          <Fragment key={row.label}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <SettingsRow {...row} onOpen={onOpen} />
          </Fragment>
        ))}
      </View>
      {note === undefined ? null : <Text style={styles.note}>{note}</Text>}
    </View>
  );
}
