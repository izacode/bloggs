export type GetBloggersQueryType = {
  SearchNameTerm: string | null;
  pageNumber: string | null;
  pageSize: string | null;
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