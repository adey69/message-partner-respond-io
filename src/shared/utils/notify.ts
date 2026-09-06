import Toast from 'react-native-toast-message';

const VISIBLE_MS = 3_000;

export function notifyFailure(message: string): void {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'bottom',
    visibilityTime: VISIBLE_MS,
  });
}
