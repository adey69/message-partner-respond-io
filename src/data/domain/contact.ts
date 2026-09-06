import type { ApiUser } from '@/data/api/types';

export type Contact = {
  id: number;
  name: string;
  avatarUrl: string;
  phone: string;
};

const NO_NAME = 'Unknown contact';

const asText = (value: string | undefined | null): string =>
  typeof value === 'string' ? value : '';

export function toContact(user: ApiUser): Contact {
  const name = asText(user.name).trim();

  return {
    id: user.id,
    name: name === '' ? NO_NAME : name,
    avatarUrl: asText(user.avatar),
    phone: asText(user.phone),
  };
}
