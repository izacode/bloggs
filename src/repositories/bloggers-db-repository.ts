import { BloggerType, CustomResponseType } from "../types/types";
import { bloggersCollection, postsCollection } from "./dbmongo";

export const bloggersRepository = {
  async getAllBloggers(SearchNameTerm: string, pageNumber: number, pageSize: number): Promise<CustomResponseType> {
    let filter = SearchNameTerm === null ? {} : { name: { $regex: SearchNameTerm } };
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
  async getAllBloggerPosts(bloggerId: number, pageNumber: number, pageSize: number): Promise<CustomResponseType | boolean> {
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
  async getBlogger(id: number): Promise<BloggerType | null> {
    const blogger = await bloggersCollection.findOne({ id }, { projection: { _id: 0 } });
    return blogger;
  },

  async createBlogger(newBlogger: BloggerType): Promise<BloggerType | null> {
    await bloggersCollection.insertOne(newBlogger);
    const createdBlogger = await bloggersCollection.findOne({ name: newBlogger.name }, { projection: { _id: 0 } });
    return createdBlogger;
  },

  async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
    const blogger = await bloggersCollection.updateOne({ id }, { $set: { name, youtubeUrl } });
    return blogger.matchedCount === 1;
  },

  async deleteBlogger(id: number): Promise<boolean> {
    const isDeleted = await bloggersCollection.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  },
};
