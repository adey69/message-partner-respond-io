import type { ReactElement, ReactNode } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react-native';
import { testQueryClient } from './queryClient';

type Rendered = RenderResult & { queryClient: QueryClient };

/** Renders a screen inside the providers the app gives it at runtime. */
export async function renderWithProviders(
  ui: ReactElement,
  queryClient: QueryClient = testQueryClient(),
): Promise<Rendered> {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { ...(await render(ui, { wrapper })), queryClient };
}
