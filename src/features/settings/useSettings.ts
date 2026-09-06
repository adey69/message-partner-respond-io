import { useCallback, useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import type { SettingsRowItem } from './components/SettingsRow';
import {
  API_HOST,
  APP_BUILD,
  APP_VERSION,
  CACHE_SUMMARY,
  PLATFORM_LABEL,
  REACT_NATIVE_VERSION,
} from './utils/appInfo';
import { owner } from './utils/owner';
import { useTheme } from '@/shared/theme/useTheme';

const CONTACT_ROWS: SettingsRowItem[] = [
  {
    label: 'Email',
    value: owner.email,
    url: `mailto:${owner.email}`,
  },
  {
    label: 'Phone',
    value: owner.phone,
    url: `tel:${owner.phone}`,
  },
  {
    label: 'GitHub',
    value: owner.github,
    url: `https://github.com/${owner.github}`,
  },
].filter(row => row.value !== '');

const DATA_ROWS: SettingsRowItem[] = [
  { label: 'API', value: API_HOST },
  { label: 'Cache', value: CACHE_SUMMARY },
];

/**
 * Everything the settings screen renders. The app follows the OS appearance
 * rather than storing a preference, so the theme row reports what the OS
 * currently resolves to and re-renders with it.
 */
export function useSettings() {
  const theme = useTheme();

  const appRows = useMemo<SettingsRowItem[]>(
    () => [
      {
        label: 'Version',
        value: `${APP_VERSION} (${APP_BUILD})`,
      },
      {
        label: 'Theme',
        value: `System · ${theme.scheme === 'dark' ? 'Dark' : 'Light'}`,
      },
      { label: 'Platform', value: PLATFORM_LABEL },
      { label: 'React Native', value: REACT_NATIVE_VERSION },
    ],
    [theme.scheme],
  );

  const openLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert(
        'Cannot open link',
        'No app on this device can handle that link.',
      );
    });
  }, []);

  return {
    owner,
    contactRows: CONTACT_ROWS,
    appRows,
    dataRows: DATA_ROWS,
    openLink,
  };
}
