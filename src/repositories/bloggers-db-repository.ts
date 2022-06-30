import { BloggerModel, PostModel } from "../models/models";
import { BloggerType, CustomResponseType } from "../types/types";
// import { bloggersCollection, postsCollection } from "./dbmongo";

export class BloggersRepository {
  async getAllBloggers(SearchNameTerm: string, pageNumber: number, pageSize: number) {
    let filter = SearchNameTerm === null ? {} : { name: { $regex: SearchNameTerm } };
    const bloggers: BloggerType[] = await BloggerModel.find(filter, "-id -__v")
      // const bloggers: BloggerType[] = await BloggerModel.find(filter, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();
    const totalCount: number = await BloggerModel.countDocuments(filter);

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: bloggers,
    };

    return customResponse;
  }
  async getAllBloggerPosts(bloggerId: string, pageNumber: number, pageSize: number): Promise<CustomResponseType | null> {
    const blogger = await BloggerModel.findOne({ id: bloggerId });
    if (!blogger) return null;
    const posts = (
      await PostModel.find({ bloggerId }, { projection: { _id: 0 } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean()
    ).map((p) => Object.assign(p, { bloggerId, bloggerName: blogger?.name }));

    const totalCount: number = await PostModel.countDocuments({ bloggerId });

    const customResponse = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize,
      totalCount,
      items: posts,
    };

    return customResponse;
  }
  async getBlogger(id: string) {
    const blogger = await BloggerModel.findOne({ id }, "-__v");
    return blogger;
  }

  async createBlogger(newBlogger: BloggerType) {
    await BloggerModel.create(newBlogger);
    const createdBlogger = await BloggerModel.findOne({ id: newBlogger.id }, { projection: { _id: 0 } });
    return createdBlogger;
  }

  async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
    // const blogger = await BloggerModel.updateOne({ id }, { $set: { name, youtubeUrl } });
    // return blogger.matchedCount === 1;
    const blogger = await BloggerModel.findOne({ id });
    if (!blogger) return false;
    blogger.name = name;
    blogger.youtubeUrl = youtubeUrl;
    await blogger.save();
    return true;
  }

  async deleteBlogger(id: string): Promise<boolean> {
    const isDeleted = await BloggerModel.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  }
  async deleteAllBloggers() {
    await BloggerModel.deleteMany({});
    const totalCount: number = await BloggerModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }
}

// export const bloggersRepository = {
//   async getAllBloggers(SearchNameTerm: string, pageNumber: number, pageSize: number) {
//     let filter = SearchNameTerm === null ? {} : { name: { $regex: SearchNameTerm } };
//     const bloggers: BloggerType[] = await bloggersCollection
//       .find(filter, { projection: { _id: 0 } })
//       .skip((pageNumber - 1) * +pageSize)
//       .limit(+pageSize)
//       .toArray();
//     const totalCount: number = await bloggersCollection.countDocuments(filter);

//     const customResponse = {
//       pagesCount: Math.ceil(totalCount / pageSize),
//       page: +pageNumber,
//       pageSize: +pageSize,
//       totalCount,
//       items: bloggers,
//     };

//     return customResponse;
//   },
//   async getAllBloggerPosts(bloggerId: string, pageNumber: number, pageSize: number): Promise<CustomResponseType | null> {
//     const blogger = await bloggersCollection.findOne({ id: bloggerId });
//     if (!blogger) return null;
//     const posts = (
//       await postsCollection
//         .find({ bloggerId }, { projection: { _id: 0 } })
//         .skip((pageNumber - 1) * pageSize)
//         .limit(pageSize)
//         .toArray()
//     ).map((p) => Object.assign(p, { bloggerId, bloggerName: blogger?.name }));

//     const totalCount: number = await postsCollection.countDocuments({ bloggerId });

//     const customResponse = {
//       pagesCount: Math.ceil(totalCount / pageSize),
//       page: +pageNumber,
//       pageSize,
//       totalCount,
//       items: posts,
//     };

//     return customResponse;
//   },
//   async getBlogger(id: string) {
//     const blogger = await bloggersCollection.findOne({ id }, { projection: { _id: 0 } });
//     return blogger;
//   },

//   async createBlogger(newBlogger: BloggerType) {
//     await bloggersCollection.insertOne(newBlogger);
//     const createdBlogger = await bloggersCollection.findOne({ id: newBlogger.id }, { projection: { _id: 0 } });
//     return createdBlogger;
//   },

//   async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
//     const blogger = await bloggersCollection.updateOne({ id }, { $set: { name, youtubeUrl } });
//     return blogger.matchedCount === 1;
//   },

//   async deleteBlogger(id: string): Promise<boolean> {
//     const isDeleted = await bloggersCollection.deleteOne({ id });
//     return isDeleted.deletedCount === 1;
//   },
// };
