import { ScrollView } from 'react-native';
import { SettingsHeader } from './components/SettingsHeader';
import { SettingsSection } from './components/SettingsSection';
import { createStyles } from './styles';
import { useSettings } from './useSettings';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const DATA_NOTE =
  'Contacts and messages come from a public sample API. Pages are cached on ' +
  'device and refreshed by pulling down on the chats list.';

export function SettingsScreen() {
  const styles = useThemedStyles(createStyles);
  const { owner, contactRows, appRows, dataRows, openLink } = useSettings();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SettingsHeader
        name={owner.name}
        role={owner.role}
        avatarUrl={owner.avatarUrl}
      />
      <SettingsSection
        title="Contact"
        rows={contactRows}
        onOpen={openLink}
      />
      <SettingsSection title="App" rows={appRows} />
      <SettingsSection title="Data" rows={dataRows} note={DATA_NOTE} />
    </ScrollView>
  );
}
