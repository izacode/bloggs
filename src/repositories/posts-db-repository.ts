import { BloggerType, PostType } from "../types/types";
import { postsCollection, bloggersCollection } from "./dbmongo";

export const postsRepository = {
  async getAllPosts(SearchTitleTerm: string | null, pageNumber: any, pageSize: any) {
    const bloggers: BloggerType[] = await bloggersCollection.find({}, { projection: { _id: 0 } }).toArray();
    let filter = SearchTitleTerm === null ? {} : { title: { $regex: SearchTitleTerm } };
    const posts: PostType[] = (
      await postsCollection
        .find(filter, { projection: { _id: 0 } })
        .skip((pageNumber - 1) * +pageSize)
        .limit(+pageSize)
        .toArray()
    ).map((p) => Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerId.toString())?.name }));

    const totalCount: number = await postsCollection.countDocuments(filter);

    const customResponse = {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: posts,
    };
    return customResponse;
  },

  async createPost(newPost: PostType): Promise<PostType | null> {
    const bloggers = await bloggersCollection.find().toArray();

    await postsCollection.insertOne(newPost);

    const createdPost = await postsCollection.findOne({ id: newPost.id }, { projection: { _id: 0 } });
    debugger;
    const createdPostWithBloggerName = Object.assign(createdPost, {
      bloggerId: +newPost.bloggerId,
      bloggerName: bloggers.find((b) => b.id === newPost.bloggerId.toString())?.name,
    });
    return createdPostWithBloggerName;
  },

  async getPost(postID: string): Promise<PostType | null> {
    const bloggers = await bloggersCollection.find({}, { projection: { _id: 0 } }).toArray();
    const post = await postsCollection.findOne({ id: postID }, { projection: { _id: 0 } });
    if (!post) return null;

    return Object.assign(post, {
      bloggerId: +post.bloggerId,
      bloggerName: bloggers.find((b) => b.id === post?.bloggerId.toString())?.name,
    });
  },

  async updatePost(postID: string, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean> {
    const post = await postsCollection.updateOne({ id: postID }, { $set: { title, shortDescription, content, bloggerId } });
    return post.matchedCount === 1;
  },
  async deletePost(postID: string) {
    const deletedPost = await postsCollection.deleteOne({ id: postID });
    return deletedPost.deletedCount === 1;
  },
};
