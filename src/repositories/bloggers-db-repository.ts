import { bloggersCollection } from "./dbmongo";

import { BloggerType } from "./db";

export const bloggersRepository = {
  async getAllBloggers(pageNumber: any, pageSize: any) {
    const bloggers = await bloggersCollection
      .find({}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    let totalCount: number = (await bloggersCollection.find().toArray()).length

    const customeResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize,
      totalCount,
      items: bloggers,
    };
    
    return customeResponse;
    // return bloggers
  },
  async getBlogger(id: number) {
    const blogger = await bloggersCollection.findOne({ id }, { projection: { _id: 0 } });
    return blogger;
  },

  async createBlogger(newBlogger: BloggerType) {
    await bloggersCollection.insertOne(newBlogger);
    const createdBlogger = await bloggersCollection.findOne({ name: newBlogger.name }, { projection: { _id: 0 } });
    return createdBlogger;
  },

  async updateBlogger(id: number, name: string, youtubeURI: string): Promise<boolean> {
    const blogger = await bloggersCollection.updateOne({ id }, { $set: { name, youtubeURI } });
    return blogger.matchedCount === 1;
  },

  async deleteBlogger(id: number): Promise<boolean> {
    const isDeleted = await bloggersCollection.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  },
};
