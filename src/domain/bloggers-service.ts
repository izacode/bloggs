import { bloggersRepository } from "../repositories/bloggers-db-repository";


export const bloggersService = {
  async getAllBloggers(SearchNameTerm: any, pageNumber: any, pageSize: any) {
    return bloggersRepository.getAllBloggers(SearchNameTerm, pageNumber, pageSize);
  },
  async getAllBloggerPosts(bloggerId: string, pageNumber: any, pageSize: any) {
    return bloggersRepository.getAllBloggerPosts(bloggerId, +pageNumber, +pageSize);
  },
  async getBlogger(id: string) {
    return bloggersRepository.getBlogger(id);
  },

  async createBlogger(name: string, youtubeUrl: string) {
    const newBlogger = {
      id: (+(new Date())).toString(),
      name,
      youtubeUrl,
    };
    return bloggersRepository.createBlogger(newBlogger);
  },

  async updateBlogger(id: string, name: string, youtubeUrl: string) {
    return bloggersRepository.updateBlogger(id, name, youtubeUrl);
  },

  async deleteBlogger(id: string) {
    return bloggersRepository.deleteBlogger(id);
  },
};
