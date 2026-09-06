import { Platform } from 'react-native';
import { BASE_URL } from '@/data/api/client';
import { CACHE_POLICY } from '@/data/query/queryClient';

const MS_PER_MINUTE = 60_000;

/**
 * Held in step by hand with `versionName` on Android and `MARKETING_VERSION`
 * on iOS; nothing at runtime reads the native value without a native module.
 */
export const APP_VERSION = '1.0';
export const APP_BUILD = '1';

export const PLATFORM_LABEL =
  Platform.OS === 'ios'
    ? `iOS ${Platform.Version}`
    : `Android API ${Platform.Version}`;

export const REACT_NATIVE_VERSION = ((): string => {
  const { major, minor, patch } = Platform.constants.reactNativeVersion;
  return `${major}.${minor}.${patch}`;
})();

export const API_HOST = BASE_URL.replace(/^https?:\/\//, '');

export const CACHE_SUMMARY = `Fresh ${
  CACHE_POLICY.staleTime / MS_PER_MINUTE
} min · kept ${CACHE_POLICY.gcTime / MS_PER_MINUTE} min`;
