import { bloggersCollection } from "./dbmongo";

import { BloggerType} from "./db";

type ErrorType = {
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

// const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;

// const isValidYoutubeURI = (field: string, regex: any) => {
//   return regex.test(field);
// };

export const bloggersRepository = {
  async getAllBloggers() {
    return await bloggersCollection.find().toArray();
  },
  async getBlogger(id: number) {
    const blogger = await bloggersCollection.findOne({ id: id });
    return blogger;
  },

  async createBlogger(newBlogger: BloggerType) {
    await bloggersCollection.insertOne(newBlogger);
    const createdBlogger = await bloggersCollection.findOne({ name: newBlogger.name });
    return createdBlogger;
  },

  async updateBlogger(id: number, name: string, youtubeURI: string): Promise<boolean> {
    const blogger = await bloggersCollection.updateOne({ id: id }, { $set: { name, youtubeURI } });
    return blogger.matchedCount === 1;
  },

  async deleteBlogger(id: number): Promise<boolean> {
    const isDeleted = await bloggersCollection.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  },
};
