import { ObjectId } from "mongodb";

export type QueryType = {
  SearchNameTerm?: string | null;
  SearchTitleTerm?: string | null;
  PageNumber: string | null;
  PageSize: string | null;
};

export type PostType = {
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName?: string;
};

export type BloggerType = {
  id?: string;
  name: string;
  youtubeUrl: string;
};

export type UserType = {
  _id?: ObjectId;
  id: string;
  login: string;
  passwordHash?: string;
  passwordSalt?: string;
};

export type CustomResponseType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BloggerType[] | PostType[] | UserType[] | CommentType[];
};

export type CommentType = {
  id: string;
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
};

// ==============================================================================================

// export type GetBloggersQueryType = {
//   SearchNameTerm: string | null;
//   pageNumber: string | null;
//   pageSize: string | null;
// };

// export type GetUsersQueryType = {
//   pageSize: string | null;
//   pageNumber: string | null;
// };

// export type GetPostsQueryType = {
//   SearchTitleTerm: string | null;
//   pageNumber: string | null;
//   pageSize: string | null;
// };
// export type GetPostCommentsQueryType = {
//   pageNumber: string | null;
//   pageSize: string | null;
// };
// ===========================================================================
// export type GetBloggersQueryType = {
//   SearchNameTerm: string | null;
//   PageNumber: string | null;
//   PageSize: string | null;
// };

// export type GetPostsQueryType = {
//   SearchTitleTerm: string | null;
//   PageNumber: string | null;
//   PageSize: string | null;
// };

// export type PostType = {
//   id?: number;
//   title: string;
//   shortDescription: string;
//   content: string;
//   bloggerId: number;
//   bloggerName?: string;
// };

// export type BloggerType = {
//   id?: number;
//   name: string;
//   youtubeUrl: string;
// };
