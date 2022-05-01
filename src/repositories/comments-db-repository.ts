import { commentsCollection } from "./dbmongo";
import { CommentType } from "../types/types";
import { ObjectId } from "mongodb";

export const commentsRepository = {
  async getAllPostComments(postId: number): Promise<CommentType[] | null> {
    const postComments = await commentsCollection.find({ postId }).toArray();
    if (!postComments) return null;
    return postComments;
  },

  async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) return null;
    return comment;
  },

  async createComment(newComment: CommentType):Promise<CommentType> {
    await commentsCollection.insertOne(newComment);
    return newComment;
  },

  async updateComment(id: string, content: string): Promise<boolean> {
    const isUpdated = await commentsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { content } });
    return isUpdated.matchedCount === 1;
  },

  async deleteComment(id: string): Promise<boolean> {
    const isDeleted = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
    return isDeleted.deletedCount === 1;
  },
};
