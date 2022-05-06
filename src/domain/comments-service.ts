import { ObjectId } from "mongodb";
import { commentsRepository } from "../repositories/comments-db-repository";
import { CommentType, CustomResponseType } from "../types/types";

export const commentsService = {
  async getAllPostComments(postId: number,PageNumber:any,PageSize:any):Promise<CustomResponseType> {

    const postComments = await commentsRepository.getAllPostComments(postId, +PageNumber, +PageSize);
    return postComments
  },

  async getCommentById(id: string):Promise<CommentType|null>{
    const comment = await commentsRepository.getCommentById(id)
    return comment
  },

  async createComment(postId: number, content: string, userId: string, login: string):Promise<CommentType |null> {
    const newComment: CommentType = {
      id:(new Date).toString(),
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
