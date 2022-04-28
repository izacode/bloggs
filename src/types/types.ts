export type GetBloggersQueryType = {
  SearchNameTerm: string | null;
  pageNumber: string | null;
  pageSize: string | null;
};

export type GetUsersQueryType = {
  pageSize: string | null;
  pageNumber: string | null;
};

export type GetPostsQueryType = {
  SearchTitleTerm: string | null;
  pageNumber: string | null;
  pageSize: string | null;
};

export type PostType = {
  id?: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerID: number;
  bloggerName?: string;
};

export type BloggerType = {
  id?: number;
  name: string;
  youtubeUrl: string;
};

export type UserType = {
  id: string;
  login: string;
  passwordHash?: string;
  passwordSalt?: string;
};

export type ErrorType = {
  data: {
    id?: number;
    name?: string;
    youtubeURI?: string;
    title?: string;
    shortDescription?: string;
    content?: string;
    bloggerID?: string;
    bloggerName?: string;
  };
  errorMessage: {
    message?: string;
    field?: string;
  };
  resultCode: number;
};

export type CustomResponseType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BloggerType[] | PostType[] | UserType[];
};
