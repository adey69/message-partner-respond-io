export type PageParams = {
  limit: number;
  offset: number;
};

export const endpoints = {
  users: ({ limit, offset }: PageParams) => `/users?limit=${limit}&offset=${offset}`,
};
