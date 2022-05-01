import { commentsCollection } from "./dbmongo";
import { CommentType } from "../types/types";

export const commentsRepository = {
  async getAllPostComments(postId: number) {
    const postComments = await commentsCollection.find({ postId });
    postComments ? postComments : null;
  },

  async getCommentById(id: number) {
    const comment = await commentsCollection.find({ id });
    return comment;
  },

  async createComment(newComment: CommentType) {
    const createdComment = await commentsCollection.insertOne(newComment);
    return createdComment;
  },

  async updateComment(id: number, content: string): Promise<boolean> {
    const isUpdated = await commentsCollection.updateOne({ id }, { $set: { content } });
    return isUpdated.matchedCount === 1;
  },

  async deleteComment(id: number): Promise<boolean> {
    const isDeleted = await commentsCollection.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  },
};
