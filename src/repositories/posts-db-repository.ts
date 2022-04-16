import { PostType } from "./db";
import { postsCollection } from "./dbmongo";

export type ErrorType = {
  errorMessage: {
    message?: string;
    field?: string;
  };
  resultCode: number;
};

export let error: ErrorType = {
  errorMessage: {},
  resultCode: 0,
};

export const postsRepository = {
  async getAllPosts(): Promise<PostType[]> {
    return await postsCollection.find().toArray();
  },

  async createPost(newPost: PostType): Promise<PostType | null> {
    await postsCollection.insertOne(newPost);
    const createdPost = await postsCollection.findOne({
      title: newPost.title,
    });
    return createdPost;
  },

  async getPost(postID: number): Promise<PostType | null> {
    const post = await postsCollection.findOne({ id: postID });
    return post;
  },

  async updatePost(
    postID: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerID: number
  ): Promise<boolean> {
    const post = await postsCollection.updateOne(
      { id: postID },
      { $set: { title, shortDescription, content, bloggerID } }
    );
    return post.matchedCount === 1;
  },
  async deletePost(postID: number) {
    const deletedPost = await postsCollection.deleteOne({ id: postID });
    return deletedPost.deletedCount === 1;
  },
};
