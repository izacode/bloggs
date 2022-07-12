import { PostsRepository } from "../repositories/posts-db-repository";
import { BloggersRepository } from "../repositories/bloggers-db-repository";
import { PostType } from "../types/types";

export class PostsService {
  constructor(protected postsRepository: PostsRepository, protected bloggersRepository: BloggersRepository) {}

  async getAllPosts(SearchTitleTerm: any, pageNumber: any, pageSize: any) {
    return this.postsRepository.getAllPosts(SearchTitleTerm, pageNumber, pageSize);
  }

  async createPost(body: any, params: any): Promise<PostType | null> {
    const bloggerID = body.bloggerId || params.bloggerId;
    const blogger = await this.bloggersRepository.getBlogger(bloggerID);
    if (!blogger) return null;
    const newPost: PostType = {
      id: (+new Date()).toString(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      bloggerId: bloggerID,
    };

    return this.postsRepository.createPost(newPost);
  }

  async getPost(postID: string): Promise<PostType | null> {
    return this.postsRepository.getPost(postID);
  }

  async updatePost(postID: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
    return this.postsRepository.updatePost(postID, title, shortDescription, content, bloggerId);
  }

  async deletePost(postID: string): Promise<boolean> {
    return this.postsRepository.deletePost(postID);
  }
}

// const postsRepository = new PostsRepository();
// const bloggersRepository = new BloggersRepository(); // Should I create it here or import from bloggesService since it's already  there
// export const postsService = new PostsService(postsRepository,bloggersRepository)

// export const postsService = {
//   async getAllPosts(SearchTitleTerm: any, pageNumber: any, pageSize: any) {
//     return postsRepository.getAllPosts(SearchTitleTerm, pageNumber, pageSize);
//   },

//   async createPost(body: any, params: any): Promise<PostType | null> {
//     const bloggerID = body.bloggerId || params.bloggerId;
//     const blogger = await bloggersRepository.getBlogger(bloggerID);
//     if (!blogger) return null;
//     const newPost: PostType = {
//       id: (+new Date()).toString(),
//       title: body.title,
//       shortDescription: body.shortDescription,
//       content: body.content,
//       bloggerId: bloggerID,
//     };

//     return postsRepository.createPost(newPost);
//   },

//   async getPost(postID: string): Promise<PostType | null> {
//     return postsRepository.getPost(postID);
//   },

//   async updatePost(postID: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
//     return postsRepository.updatePost(postID, title, shortDescription, content, bloggerId);
//   },

//   async deletePost(postID: string): Promise<boolean> {
//     return postsRepository.deletePost(postID);
//   },
// };
