import { BloggerModel, PostModel } from "../models/models";
import { BloggerType, CustomResponseType, PostType } from "../types/types";


export class PostsRepository {
  async getAllPosts(SearchTitleTerm: string | null, pageNumber: any, pageSize: any): Promise<CustomResponseType> {
    const bloggers: BloggerType[] = await BloggerModel.find({}, { projection: { _id: 0 } }).lean();
    let filter = SearchTitleTerm === null ? {} : { title: { $regex: SearchTitleTerm } };
    const posts: PostType[] = (
      await PostModel.find(filter, "-_id -__v")
        .skip((pageNumber - 1) * +pageSize)
        .limit(+pageSize)
        .lean()
    ).map((p) =>
      Object.assign(p, {
        bloggerName: bloggers.find((b) => b.id === p.bloggerId)?.name,
      })
    );

    const totalCount: number = await PostModel.countDocuments(filter);

    const customResponse = {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: posts,
    };
    return customResponse;
  }

  async createPost(newPost: PostType): Promise<PostType | null> {
    const bloggers = await BloggerModel.find().lean();

    await PostModel.create(newPost);

    const createdPost = await PostModel.findOne({ id: newPost.id }, "-_id -__v");
    if (!createdPost) return null;
    const createdPostWithBloggerName = Object.assign(createdPost, {
      bloggerName: bloggers.find((b) => b.id === newPost.bloggerId.toString())?.name,
    });
    return createdPostWithBloggerName;
  }

  async getPost(postID: string): Promise<PostType | null> {
    const bloggers = await BloggerModel.find({}, "-_id").lean();
    const post = await PostModel.findOne({ id: postID }, "-_id -__v");
    if (!post) return null;

    return Object.assign(post, {
      bloggerName: bloggers.find((b) => b.id === post?.bloggerId.toString())?.name,
    });
  }

  async updatePost(postID: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
    const post = await PostModel.findOne({ id: postID });
    if (!post) return false;
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.bloggerId = bloggerId;
    await post.save();
    return true;
  }
  async deletePost(postID: string) {
    const deletedPost = await PostModel.deleteOne({ id: postID });
    return deletedPost.deletedCount === 1;
  }
  async deleteAllPosts() {
    await PostModel.deleteMany({});
    const totalCount: number = await PostModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }
}
