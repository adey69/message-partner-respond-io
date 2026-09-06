import { useCallback } from 'react';
import { useContact } from './hooks/useContact';
import { useBlockStore } from '@/store/blockStore';

export function useProfile(contactId: number) {
  const { data: contact, isPending, refetch } = useContact(contactId);
  const isBlocked = useBlockStore(state => state.blocked[contactId] === true);
  const toggleBlock = useBlockStore(state => state.toggleBlock);

  const handleToggleBlock = useCallback(
    () => toggleBlock(contactId),
    [toggleBlock, contactId],
  );

  return {
    contact,
    isPending,
    isBlocked,
    toggleBlock: handleToggleBlock,
    retry: refetch,
  };
}
