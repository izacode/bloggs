import { ObjectId } from "mongodb";
import { commentsRepository } from "../repositories/comments-db-repository";
import { CommentType } from "../types/types";

export const commentsService = {
  async getAllPostComments(postId: number):Promise<CommentType[]|null> {

    const postComments = await commentsRepository.getAllPostComments(postId)
    return postComments
  },

  async getCommentById(id: string):Promise<CommentType|null>{
    const comment = await commentsRepository.getCommentById(id)
    return comment
  },

  async createComment(postId: number, content: string, userId: ObjectId, login: string):Promise<CommentType> {
    const newComment: CommentType = {
      postId,
      content,
      userId,
      login,
      createdAt: new Date().toISOString(),
    };

    const createdComment = await commentsRepository.createComment(newComment);
    return createdComment;
  },

  async updateComment(id: string, content: string):Promise<boolean>{    
      const isUpdated = commentsRepository.updateComment(id,content)
      return isUpdated
  },
  async deleteComment(id:string):Promise<boolean>{
      const isDeleted = commentsRepository.deleteComment(id)
      return isDeleted
  }
};
