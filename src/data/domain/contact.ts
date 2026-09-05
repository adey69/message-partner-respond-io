import type { ApiUser } from '@/data/api/types';

export type Contact = {
  id: number;
  name: string;
  avatarUrl: string;
  phone: string;
};

export function toContact(user: ApiUser): Contact {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatar,
    phone: user.phone,
  };
}
