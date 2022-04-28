import { bloggersRepository } from "../repositories/bloggers-db-repository";
import { BloggerType, CustomResponseType } from "../types/types";


export const bloggersService = {
  async getAllBloggers(SearchNameTerm: any, pageNumber: any, pageSize: any): Promise<CustomResponseType> {
    return bloggersRepository.getAllBloggers(SearchNameTerm, pageNumber, pageSize);
  },
  async getAllBloggerPosts(bloggerId: number, pageNumber: any, pageSize: number): Promise<CustomResponseType | boolean> {
    return bloggersRepository.getAllBloggerPosts(bloggerId, pageNumber, pageSize);
  },
  async getBlogger(id: number) {
    return bloggersRepository.getBlogger(id);
  },

  async createBlogger(id: number, name: string, youtubeUrl: string): Promise<BloggerType | null> {
    const newBlogger = {
      id,
      name,
      youtubeUrl,
    };
    return bloggersRepository.createBlogger(newBlogger);
  },

  async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
    return bloggersRepository.updateBlogger(id, name, youtubeUrl);
  },

  async deleteBlogger(id: number): Promise<boolean> {
    return bloggersRepository.deleteBlogger(id);
  },
};
