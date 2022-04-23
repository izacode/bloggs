import { BloggerType, PostType } from "./db";
import { postsCollection, bloggersCollection } from "./dbmongo";

export const postsRepository = {
  async getAllPosts(SearchTitleTerm: string, pageNumber: any, pageSize: any) {
    const bloggers: BloggerType[] = await bloggersCollection.find({}, { projection: { _id: 0 } }).toArray();
    let posts: PostType[];
    let totalCount: number;

    if (SearchTitleTerm === null) {
      posts = (
        await postsCollection
          .find({}, { projection: { _id: 0 } })
          .skip((pageNumber - 1) * +pageSize)
          .limit(+pageSize)
          .toArray()
      ).map((p) => Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name }));

      totalCount = (await postsCollection.find().toArray()).length;
    } else {
      posts = (
        await postsCollection
          .find({ title: { $regex: SearchTitleTerm } }, { projection: { _id: 0 } })
          .skip((pageNumber - 1) * +pageSize)
          .limit(+pageSize)
          .toArray()
      ).map((p) => Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name }));
      totalCount = (await postsCollection.find({ title: { $regex: SearchTitleTerm } }).toArray()).length;
    }
    
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
    console.log(bloggers)
    await postsCollection.insertOne(newPost);
    const createdPost = await postsCollection.findOne({ title: newPost.title }, { projection: { _id: 0 } });
    const createdPostWithBloggerName = Object.assign(createdPost, { bloggerName: bloggers.find((b) => b.id === newPost.bloggerID)?.name });
    return createdPostWithBloggerName;
  },

  async getPost(postID: number): Promise<PostType | null> {
    const bloggers = await bloggersCollection.find({}, { projection: { _id: 0 } }).toArray();
    const post = await postsCollection.findOne({ id: postID }, { projection: { _id: 0 } });
    return Object.assign(post, { bloggerName: bloggers.find((b) => b.id === post?.bloggerID)?.name });
  },

  async updatePost(postID: number, title: string, shortDescription: string, content: string, bloggerID: number): Promise<boolean> {
    const post = await postsCollection.updateOne({ id: postID }, { $set: { title, shortDescription, content, bloggerID } });
    return post.matchedCount === 1;
  },
  async deletePost(postID: number) {
    const deletedPost = await postsCollection.deleteOne({ id: postID });
    return deletedPost.deletedCount === 1;
  },
};
