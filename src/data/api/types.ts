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

export type ApiPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  category: string;
  createdAt: string;
};

/** The API rejects a post without a title, which a chat message does not have. */
export type ApiNewPost = {
  userId: number;
  title: string;
  body: string;
};
