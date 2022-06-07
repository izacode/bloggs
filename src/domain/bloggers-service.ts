import { BloggersRepository } from "../repositories/bloggers-db-repository";
import { CustomResponseType } from "../types/types";

class BloggersService {
  constructor(private bloggersRepository:BloggersRepository){}
  async getAllBloggers(SearchNameTerm: any, pageNumber: any, pageSize: any) {
    return this.bloggersRepository.getAllBloggers(SearchNameTerm, pageNumber, pageSize);
  }
  async getAllBloggerPosts(bloggerId: string, pageNumber: any, pageSize: any): Promise<CustomResponseType | null> {
    return this.bloggersRepository.getAllBloggerPosts(bloggerId, +pageNumber, +pageSize);
  }
  async getBlogger(id: string) {
    return this.bloggersRepository.getBlogger(id);
  }

  async createBlogger(name: string, youtubeUrl: string) {
    const newBlogger = {
      id: (+new Date()).toString(),
      name,
      youtubeUrl,
    };
    return this.bloggersRepository.createBlogger(newBlogger);
  }

  async updateBlogger(id: string, name: string, youtubeUrl: string) {
    return this.bloggersRepository.updateBlogger(id, name, youtubeUrl);
  }

  async deleteBlogger(id: string) {
    return this.bloggersRepository.deleteBlogger(id);
  }
}

const bloggersRepository = new BloggersRepository()
export const bloggersService = new BloggersService(bloggersRepository); 



// export const bloggersService = {
//   async getAllBloggers(SearchNameTerm: any, pageNumber: any, pageSize: any) {
//     return bloggersRepository.getAllBloggers(SearchNameTerm, pageNumber, pageSize);
//   },
//   async getAllBloggerPosts(bloggerId: string, pageNumber: any, pageSize: any): Promise<CustomResponseType | null> {
//     return bloggersRepository.getAllBloggerPosts(bloggerId, +pageNumber, +pageSize);
//   },
//   async getBlogger(id: string) {
//     return bloggersRepository.getBlogger(id);
//   },

//   async createBlogger(name: string, youtubeUrl: string) {
//     const newBlogger = {
//       id: (+new Date()).toString(),
//       name,
//       youtubeUrl,
//     };
//     return bloggersRepository.createBlogger(newBlogger);
//   },

//   async updateBlogger(id: string, name: string, youtubeUrl: string) {
//     return bloggersRepository.updateBlogger(id, name, youtubeUrl);
//   },

//   async deleteBlogger(id: string) {
//     return bloggersRepository.deleteBlogger(id);
//   },
// };
