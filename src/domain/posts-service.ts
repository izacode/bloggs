
import { postsRepository } from "../repositories/posts-db-repository";
import { bloggersRepository } from "../repositories/bloggers-db-repository";
import { PostType } from "../types/types";

export const postsService = {
  async getAllPosts(SearchTitleTerm: any, pageNumber: any, pageSize: any) {
    return postsRepository.getAllPosts(SearchTitleTerm, pageNumber, pageSize);
  },

  async createPost(body: any, params: any): Promise<PostType | null> {
    const bloggerID = body.bloggerId || params.bloggerId;
    const blogger = await bloggersRepository.getBlogger(bloggerID);
    if (!blogger) return null;
    const newPost: PostType = {
      id: (+new Date()).toString(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      bloggerId: bloggerID,
    };

    return postsRepository.createPost(newPost);
  },

  async getPost(postID: string): Promise<PostType | null> {
    return postsRepository.getPost(postID);
  },

  async updatePost(postID: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
    return postsRepository.updatePost(postID, title, shortDescription, content, bloggerId);
  },

  async deletePost(postID: string): Promise<boolean> {
    return postsRepository.deletePost(postID);
  },
};
