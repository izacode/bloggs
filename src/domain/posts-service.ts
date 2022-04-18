import { PostType } from "../repositories/db";
import { Request } from "express";
import { postsRepository } from "../repositories/posts-db-repository";

export const postsService = {
  async getAllPosts(pageNumber: any, pageSize: any) {
    return postsRepository.getAllPosts(pageNumber, pageSize);
  },

  async createPost(req: Request): Promise<PostType | null> {
    const newPost: PostType = {
      id: +req.body.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerID: req.body.bloggerID || +req.params.id,
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
