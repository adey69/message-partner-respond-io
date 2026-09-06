import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useSendMessage } from './useSendMessage';
import { failNextRequest, fetchMock, respondWith } from '@test/apiMock';
import { testQueryClient } from '@test/queryClient';
import { useOutboxStore } from '@/store/outboxStore';

const CONTACT_ID = 1;

/** The post the API echoes back. Its id is the same every time, so it is discarded. */
const CREATED_POST = {
  id: 101,
  userId: CONTACT_ID,
  title: 'Message',
  body: 'hi',
};

const sent = () => useOutboxStore.getState().messages[CONTACT_ID] ?? [];

const renderSend = () => {
  const client = testQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return renderHook(() => useSendMessage(CONTACT_ID), { wrapper });
};

beforeEach(() => useOutboxStore.setState({ messages: {} }));

describe('useSendMessage', () => {
  it('shows the message before the request has answered', async () => {
    // A request that never settles, so the optimistic state is the only state.
    fetchMock().mockReturnValueOnce(new Promise<Response>(() => {}));
    const { result } = await renderSend();

    result.current.send('on my way');

    await waitFor(() => expect(sent()).toHaveLength(1));
    expect(sent()[0].body).toBe('on my way');
    expect(sent()[0].status).toBe('pending');
    expect(sent()[0].direction).toBe('outgoing');
  });

  it('marks the message sent once the request succeeds', async () => {
    respondWith(CREATED_POST, 201);
    const { result } = await renderSend();

    result.current.send('on my way');

    await waitFor(() => expect(sent()[0]?.status).toBe('sent'));
  });

  it('marks the message failed and keeps it visible', async () => {
    failNextRequest();
    const { result } = await renderSend();

    result.current.send('on my way');

    await waitFor(() => expect(sent()[0]?.status).toBe('failed'));
    expect(sent()[0].body).toBe('on my way');
  });

  // The id is what holds the bubble's place in the thread, so resending must
  // reuse the existing entry rather than queue a second one.
  it('resends a failed message in place', async () => {
    failNextRequest();
    const { result } = await renderSend();

    result.current.send('on my way');
    await waitFor(() => expect(sent()[0]?.status).toBe('failed'));
    const { id } = sent()[0];

    respondWith(CREATED_POST, 201);
    result.current.retry(id);

    await waitFor(() => expect(sent()[0]?.status).toBe('sent'));
    expect(sent()).toHaveLength(1);
    expect(sent()[0].id).toBe(id);
  });

  it('never adopts the id the API hands back', async () => {
    respondWith(CREATED_POST, 201);
    const { result } = await renderSend();

    result.current.send('on my way');

    await waitFor(() => expect(sent()[0]?.status).toBe('sent'));
    expect(sent()[0].id).not.toBe(String(CREATED_POST.id));
  });
});
