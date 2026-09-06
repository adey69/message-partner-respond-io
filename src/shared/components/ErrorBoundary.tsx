import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { createErrorBoundaryStyles } from './ErrorBoundary.styles';
import { StateMessage } from './StateMessage';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | undefined;
};

/**
 * The fallback is its own component so it can read the theme through a hook.
 * A boundary has to be a class — there is no hook equivalent of
 * `getDerivedStateFromError` — and a class cannot.
 */
function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  const styles = useThemedStyles(createErrorBoundaryStyles);

  return (
    <View style={styles.screen}>
      <StateMessage
        title="Something went wrong"
        message={
          __DEV__ ? error.message : 'The app ran into an unexpected problem.'
        }
        actionLabel="Try again"
        onAction={onRetry}
      />
    </View>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: undefined };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    BootSplash.hide();

    // Where this app logs, a release build would report to a crash service.
    console.error('Unhandled render error', error, info.componentStack);
  }

  private handleRetry = () => this.setState({ error: undefined });

  render() {
    const { error } = this.state;

    if (error !== undefined) {
      return <ErrorFallback error={error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
