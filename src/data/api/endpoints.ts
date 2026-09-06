export type PageParams = {
  limit: number;
  offset: number;
};

export type ThreadParams = PageParams & {
  userId: number;
};

export const endpoints = {
  users: ({ limit, offset }: PageParams) => `/users?limit=${limit}&offset=${offset}`,
  posts: ({ userId, limit, offset }: ThreadParams) =>
    `/posts?userId=${userId}&limit=${limit}&offset=${offset}`,
  createPost: () => '/posts',
};
