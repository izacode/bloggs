import { bloggersRepository } from "../repositories/bloggers-db-repository";


export const bloggersService = {
  async getAllBloggers(SearchNameTerm: any, pageNumber: any, pageSize: any) {
    return bloggersRepository.getAllBloggers(SearchNameTerm, pageNumber, pageSize);
  },
  async getAllBloggerPosts(bloggerId: number, pageNumber: any, pageSize: number) {
    return bloggersRepository.getAllBloggerPosts(bloggerId, pageNumber, pageSize);
  },
  async getBlogger(id: number) {
    return bloggersRepository.getBlogger(id);
  },

  async createBlogger(id: number, name: string, youtubeUrl: string) {
    debugger;
    const newBlogger = {
      id,
      name,
      youtubeUrl,
    };
    return bloggersRepository.createBlogger(newBlogger);
  },

  async updateBlogger(id: number, name: string, youtubeUrl: string) {
    return bloggersRepository.updateBlogger(id, name, youtubeUrl);
  },

  async deleteBlogger(id: number) {
    return bloggersRepository.deleteBlogger(id);
  },
};
