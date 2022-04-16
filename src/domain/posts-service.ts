import { PostType } from "../repositories/db";
import { Request } from "express";
import { postsRepository } from "../repositories/posts-db-repository";

export type ErrorType = {
  data: {
    id?: number;
    name?: string;
    youtubeURI?: string;
    title?: string;
    shortDescription?: string;
    content?: string;
    bloggerID?: number;
    bloggerName?: string;
  };
  errorMessage: {
    message?: string;
    field?: string;
  };
  resultCode: number;
};

export let error: ErrorType = {
  data: {},
  errorMessage: {},
  resultCode: 0,
};

export const postsService = {
  async getAllPosts(): Promise<PostType[]> {
    return postsRepository.getAllPosts();
  },

  async createPost(req: Request): Promise<PostType | null> {
    const newPost: PostType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerID: req.body.bloggerID,
    };
    const createdPost = await postsRepository.createPost(newPost);

    return createdPost;
  },

  async getPost(postID: number): Promise<PostType | null> {
    return postsRepository.getPost(postID);
  },

  async updatePost(
    postID: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerID: number
  ): Promise<boolean> {
    return postsRepository.updatePost(postID, title, shortDescription, content, bloggerID);
  },
  async deletePost(postID: number): Promise<boolean> {
    return postsRepository.deletePost(postID);
  },
};
