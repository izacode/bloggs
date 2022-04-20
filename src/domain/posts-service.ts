import { PostType } from "../repositories/db";
import { Request } from "express";
import { postsRepository } from "../repositories/posts-db-repository";
import { bloggersRepository } from "../repositories/bloggers-db-repository";

export const postsService = {
  async getAllPosts(SearchTitleTerm: any, pageNumber: any, pageSize: any) {
    return postsRepository.getAllPosts(SearchTitleTerm, pageNumber, pageSize);
  },

  async createPost(req: Request): Promise<PostType | null> {
    const bloggerID = req.body.bloggerID || +req.params.id;
    const blogger = await bloggersRepository.getBlogger(bloggerID);
    if (!blogger) return null;
    const newPost: PostType = {
      id: +req.body.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerID,
    };

    return postsRepository.createPost(newPost);
  },

  async getPost(postID: number): Promise<PostType | null> {
    return postsRepository.getPost(postID);
  },

  async updatePost(postID: number, title: string, shortDescription: string, content: string, bloggerID: number): Promise<boolean> {
    return postsRepository.updatePost(postID, title, shortDescription, content, bloggerID);
  },

  async deletePost(postID: number): Promise<boolean> {
    return postsRepository.deletePost(postID);
  },
};
