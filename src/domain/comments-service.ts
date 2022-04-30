import { ObjectId } from "mongodb";
import { commentsRepository } from "../repositories/comments-db-repository";

export const commentsService = {
  async createComment(content: string, id: ObjectId) {
    const newComment = {
      id,
      content,
    };

    const createdComment = await commentsRepository.createComment(newComment);
    return createdComment;
  },
};
