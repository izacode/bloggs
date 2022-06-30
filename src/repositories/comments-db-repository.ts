// import { commentsCollection } from "./dbmongo";
import { CommentType, CustomResponseType } from "../types/types";
import { CommentModel } from "../models/models";

const commentsFilter = "-_id -postId -__v";
// const commentsFilter = { projection: { _id: 0, postId: 0 } };

export class CommentsRepository {
  async getAllPostComments(postId: string, PageNumber: number, PageSize: number): Promise<CustomResponseType> {
    const postComments = await CommentModel.find({ postId }, commentsFilter)
      .skip((PageNumber - 1) * PageSize)
      .limit(PageSize)
      .lean();

    const totalCount: number = await CommentModel.countDocuments({ postId });

    const customResponse = {
      pagesCount: Math.ceil(totalCount / PageSize),
      page: PageNumber,
      pageSize: PageSize,
      totalCount,
      items: postComments,
    };
    return customResponse;
  }

  async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await CommentModel.findOne({ id }, commentsFilter);
    if (!comment) return null;
    return comment;
  }

  async createComment(newComment: CommentType): Promise<CommentType | null> {
    await CommentModel.create(newComment);
    const createdComment = await CommentModel.findOne({ id: newComment.id }, commentsFilter);
    return createdComment;
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    // const isUpdated = await commentsCollection.updateOne({ id }, { $set: { content } });
    // return isUpdated.matchedCount === 1;
    const comment = await CommentModel.findOne({ id });
    if (!comment) return false;
    comment.content = content;
    await comment.save();
    return true;
  }

  async deleteComment(id: string): Promise<boolean> {
    const isDeleted = await CommentModel.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  }
  async deleteAllComments() {
    await CommentModel.deleteMany({});
    const totalCount: number = await CommentModel.countDocuments({});
    if (totalCount !== 0) return false;
    return true;
  }
}

// export const commentsRepository = {
//   async getAllPostComments(postId: string, PageNumber: number, PageSize: number): Promise<CustomResponseType> {
//     const postComments = await commentsCollection
//       .find({ postId }, commentsFilter)
//       .skip((PageNumber - 1) * PageSize)
//       .limit(PageSize)
//       .toArray();

//     const totalCount: number = await commentsCollection.countDocuments({ postId });

//     const customResponse = {
//       pagesCount: Math.ceil(totalCount / PageSize),
//       page: PageNumber,
//       pageSize: PageSize,
//       totalCount,
//       items: postComments,
//     };
//     return customResponse;
//   },

//   async getCommentById(id: string): Promise<CommentType | null> {
//     const comment = await commentsCollection.findOne({ id }, commentsFilter);
//     if (!comment) return null;
//     return comment;
//   },

//   async createComment(newComment: CommentType): Promise<CommentType | null> {
//     await commentsCollection.insertOne(newComment);
//     const createdComment = await commentsCollection.findOne({ id: newComment.id }, commentsFilter);
//     return createdComment;
//   },

//   async updateComment(id: string, content: string): Promise<boolean> {
//     const isUpdated = await commentsCollection.updateOne({ id }, { $set: { content } });
//     return isUpdated.matchedCount === 1;
//   },

//   async deleteComment(id: string): Promise<boolean> {
//     const isDeleted = await commentsCollection.deleteOne({ id });
//     return isDeleted.deletedCount === 1;
//   },
// };
