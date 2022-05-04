
import { postsRepository } from "../repositories/posts-db-repository";
import { bloggersRepository } from "../repositories/bloggers-db-repository";
import { PostType } from "../types/types";

export const postsService = {
  async getAllPosts(SearchTitleTerm: any, pageNumber: any, pageSize: any) {
    return postsRepository.getAllPosts(SearchTitleTerm, pageNumber, pageSize);
  },

  async createPost(body: any, params: any): Promise<PostType | null> {
    const bloggerID = body.bloggerID || +params.id;
    const blogger = await bloggersRepository.getBlogger(bloggerID);
    if (!blogger) return null;
    const newPost: PostType = {
      id: +(new Date),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      bloggerID,
    };

    return postsRepository.createPost(newPost);
  },

  async getPost(postID: number): Promise<PostType | null> {
    return postsRepository.getPost(postID);
  },

  async updatePost(postID: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean> {
    return postsRepository.updatePost(postID, title, shortDescription, content, bloggerId);
  },

  async deletePost(postID: number): Promise<boolean> {
    return postsRepository.deletePost(postID);
  },
};
