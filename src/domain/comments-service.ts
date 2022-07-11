import { CommentsRepository } from "../repositories/comments-db-repository";
import { CommentType, CustomResponseType } from "../types/types";

export class CommentsService {
  commentsRepository: CommentsRepository;
  constructor() {
    this.commentsRepository = new CommentsRepository()
  }
  async getAllPostComments(postId: string, PageNumber: any, PageSize: any): Promise<CustomResponseType> {
    const postComments = await this.commentsRepository.getAllPostComments(postId, +PageNumber, +PageSize);
    return postComments;
  }

  async getCommentById(commentId: string): Promise<CommentType | null> {
    const comment = await this.commentsRepository.getCommentById(commentId);
    return comment;
  }

  async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentType | null> {
    const newComment: CommentType = {
      id: (+new Date()).toString(),
      postId,
      content,
      userId,
      userLogin,
      addedAt: new Date().toISOString(),
    };

    const createdComment = await this.commentsRepository.createComment(newComment);
    return createdComment;
  }

  async updateComment(commentId: string, content: string): Promise<boolean> {
    const isUpdated = await this.commentsRepository.updateComment(commentId, content);
    return isUpdated;
  }
  async deleteComment(commentId: string): Promise<boolean> {
    const isDeleted = await this.commentsRepository.deleteComment(commentId);
    return isDeleted;
  }
}

// const commentsRepository = new CommentsRepository();
// export const commentsService = new CommentsService(commentsRepository);


// export const commentsService = {
//   async getAllPostComments(postId: string, PageNumber: any, PageSize: any): Promise<CustomResponseType> {
//     const postComments = await commentsRepository.getAllPostComments(postId, +PageNumber, +PageSize);
//     return postComments;
//   },

//   async getCommentById(commentId: string): Promise<CommentType | null> {
//     const comment = await commentsRepository.getCommentById(commentId);
//     return comment;
//   },

//   async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentType | null> {
//     const newComment: CommentType = {
//       id: (+new Date()).toString(),
//       postId,
//       content,
//       userId,
//       userLogin,
//       addedAt: new Date().toISOString(),
//     };

//     const createdComment = await commentsRepository.createComment(newComment);
//     return createdComment;
//   },

//   async updateComment(commentId: string, content: string): Promise<boolean> {
//     const isUpdated = commentsRepository.updateComment(commentId, content);
//     return isUpdated;
//   },
//   async deleteComment(commentId: string): Promise<boolean> {
//     const isDeleted = commentsRepository.deleteComment(commentId);
//     return isDeleted;
//   },
// };
