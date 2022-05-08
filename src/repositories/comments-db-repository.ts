import { commentsCollection } from "./dbmongo";
import { CommentType, CustomResponseType } from "../types/types";

const commentsFilter = { projection: { _id: 0, postId: 0 } };
export const commentsRepository = {
  async getAllPostComments(postId: string, PageNumber: number, PageSize: number): Promise<CustomResponseType> {
    const postComments = await commentsCollection
      .find({ postId }, commentsFilter)
      .skip((PageNumber - 1) * PageSize)
      .limit(PageSize)
      .toArray();

    const totalCount: number = await commentsCollection.countDocuments();

    const customResponse = {
      pagesCount: Math.ceil(totalCount / PageSize),
      page: PageNumber,
      pageSize: PageSize,
      totalCount,
      items: postComments,
    };
    return customResponse;
  },

  async getCommentById(commentId: string): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne({ commentId }, commentsFilter);
    if (!comment) return null;
    return comment;
  },

  async createComment(newComment: CommentType): Promise<CommentType | null> {
    await commentsCollection.insertOne(newComment);
    const createdComment = await commentsCollection.findOne({ commentId: newComment.commentId }, commentsFilter);
    return createdComment;
  },

  async updateComment(commentId: string, content: string): Promise<boolean> {
    const isUpdated = await commentsCollection.updateOne({ commentId }, { $set: { content } });
    return isUpdated.matchedCount === 1;
  },

  async deleteComment(commentId: string): Promise<boolean> {
    const isDeleted = await commentsCollection.deleteOne({ commentId });
    return isDeleted.deletedCount === 1;
  },
};
