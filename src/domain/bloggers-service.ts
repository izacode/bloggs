import { bloggersRepository } from "../repositories/bloggers-db-repository";


export const bloggersService = {
  async getAllBloggers(pageNumber:any, pageSize:any) {
    
    return bloggersRepository.getAllBloggers(pageNumber, pageSize);
  },
  async getBlogger(id: number) {
    return bloggersRepository.getBlogger(id);
  },

  async createBlogger(name: string, youtubeURI: string) {
    const newBlogger = {
    
      name: name,
      youtubeURI: youtubeURI,
    };
    return await bloggersRepository.createBlogger(newBlogger);
  },

  async updateBlogger(id: number, name: string, youtubeURI: string) {
    return bloggersRepository.updateBlogger(id, name, youtubeURI);
  },

  async deleteBlogger(id: number) {
    return bloggersRepository.deleteBlogger(id);
  },
};