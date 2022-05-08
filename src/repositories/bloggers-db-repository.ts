import { BloggerType, CustomResponseType } from "../types/types";
import { bloggersCollection, postsCollection } from "./dbmongo";

export const bloggersRepository = {
  async getAllBloggers(SearchNameTerm: string, pageNumber: number, pageSize: number) {
    let filter = SearchNameTerm === null ? {} : { name: { $regex: SearchNameTerm } };
    debugger;
    const bloggers: BloggerType[] = await bloggersCollection
      .find(filter, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();
    const totalCount: number = await bloggersCollection.countDocuments(filter);

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: bloggers,
    };

    return customResponse;
  },
  async getAllBloggerPosts(bloggerId: string, pageNumber: number, pageSize: number): Promise<CustomResponseType | null> {
    const blogger = await bloggersCollection.findOne({ id: bloggerId });
    if (!blogger) return null;
    const posts = (
      await postsCollection
        .find({ bloggerId }, { projection: { _id: 0 } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray()
    ).map((p) => Object.assign(p, { bloggerId, bloggerName: blogger?.name }));

    const totalCount: number = await postsCollection.countDocuments({ bloggerId });

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize,
      totalCount,
      items: posts,
    };

    return customResponse;
  },
  async getBlogger(id: string) {
    const blogger = await bloggersCollection.findOne({ id }, { projection: { _id: 0 } });
    return blogger;
  },

  async createBlogger(newBlogger: BloggerType) {
    await bloggersCollection.insertOne(newBlogger);
    const createdBlogger = await bloggersCollection.findOne({ id: newBlogger.id }, { projection: { _id: 0 } });
    return createdBlogger;
  },

  async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
    const blogger = await bloggersCollection.updateOne({ id }, { $set: { name, youtubeUrl } });
    return blogger.matchedCount === 1;
  },

  async deleteBlogger(id: string): Promise<boolean> {
    const isDeleted = await bloggersCollection.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  },
};
