import { commentsCollection } from "./dbmongo";
import { CommentType, CustomResponseType } from "../types/types";


export const commentsRepository = {
  async getAllPostComments(postId: number, PageNumber: number, PageSize: number): Promise<CustomResponseType> {
    const postComments = await commentsCollection
      .find({ postId })
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

  async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne({id});
    if (!comment) return null;
    return comment;
  },

  async createComment(newComment: CommentType): Promise<CommentType | null> {
    await commentsCollection.insertOne(newComment);
    const createdComment = await commentsCollection.findOne({id: newComment.id},{projection:{postId:0}})
    return createdComment;
  },

  async updateComment(id: string, content: string): Promise<boolean> {
    const isUpdated = await commentsCollection.updateOne({ id}, { $set: { content } });
    return isUpdated.matchedCount === 1;
  },

  async deleteComment(id: string): Promise<boolean> {
    const isDeleted = await commentsCollection.deleteOne({ id});
    return isDeleted.deletedCount === 1;
  },
};
