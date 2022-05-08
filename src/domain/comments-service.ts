
import { commentsRepository } from "../repositories/comments-db-repository";
import { CommentType, CustomResponseType } from "../types/types";

export const commentsService = {
  async getAllPostComments(postId: string, PageNumber: any, PageSize: any): Promise<CustomResponseType> {
    const postComments = await commentsRepository.getAllPostComments(postId, +PageNumber, +PageSize);
    return postComments;
  },

  async getCommentById(commentId: string): Promise<CommentType | null> {
    const comment = await commentsRepository.getCommentById(commentId);
    return comment;
  },

  async createComment(postId: string, content: string, userId: string, login: string): Promise<CommentType | null> {
    const newComment: CommentType = {
      id: (+new Date()).toString(),
      postId,
      content,
      userId,
      login,
      createdAt: new Date().toISOString(),
    };

    const createdComment = await commentsRepository.createComment(newComment);
    return createdComment;
  },

  async updateComment(commentId: string, content: string): Promise<boolean> {
    const isUpdated = commentsRepository.updateComment(commentId, content);
    return isUpdated;
  },
  async deleteComment(commentId: string): Promise<boolean> {
    const isDeleted = commentsRepository.deleteComment(commentId);
    return isDeleted;
  },
};
