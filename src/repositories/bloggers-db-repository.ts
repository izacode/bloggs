import { bloggersCollection, postsCollection } from "./dbmongo";

import { BloggerType } from "./db";

export const bloggersRepository = {
  async getAllBloggers(pageNumber: any, pageSize: any) {
    const bloggers = await bloggersCollection
      .find({}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    let totalCount: number = (await bloggersCollection.find().toArray()).length;

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize,
      totalCount,
      items: bloggers,
    };

    return customResponse;
  },
  async getAllBloggerPosts(bloggerId: number, pageNumber: any, pageSize: any) {
    const blogger = await bloggersCollection.findOne({ id: bloggerId });
    console.log(blogger);
    const posts = (
      await postsCollection
        .find({ bloggerID: bloggerId }, { projection: { _id: 0 } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray()
    ).map((p) => Object.assign(p, { bloggerName: blogger?.name }));

    let totalCount: number = posts.length;

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize,
      totalCount,
      items: posts,
    };

    return blogger !== null ? customResponse : false;
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
