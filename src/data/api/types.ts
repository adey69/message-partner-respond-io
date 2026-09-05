/** The envelope every list endpoint returns. */
export type ApiListResponse<T> = {
  total: number;
  limit: number;
  offset: number;
  results: T[];
};

export type ApiUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
};
