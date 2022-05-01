import { ObjectId } from "mongodb";
import { commentsRepository } from "../repositories/comments-db-repository";
import { CommentType } from "../types/types";

export const commentsService = {
  async getAllPostComments(postId: number) {

    const postComments = await commentsRepository.getAllPostComments(postId)
    return postComments
  },

  async getCommentById(id: number){
    const comment = await commentsRepository.getCommentById(id)
    return comment
  },

  async createComment(postId: number, content: string, userId: ObjectId, login: string) {
    const newComment: CommentType = {
      postId,
      content,
      userId,
      login,
      createdAt: new Date().toDateString(),
    };

    const createdComment = await commentsRepository.createComment(newComment);
    return createdComment;
  },

  async updateComment(id: number, content: string){    
      const isUpdated = commentsRepository.updateComment(id,content)
      return isUpdated
  },
  async deleteComment(id:number){
      const isDeleted = commentsRepository.deleteComment(id)
      return isDeleted
  }
};
