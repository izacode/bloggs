import e, { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { CommentsService } from "../domain/comments-service";
import { authentication, userAuthorization } from "../middleware/authMiddleware";
import { commentContentValidation, contentValidation, inputValidationMiddleware } from "../middleware/inputValidation";
import { CommentType } from "../types/types";

export const commentsRouter = Router();

class CommentsController {

  commentsService: CommentsService

  constructor(){
    this.commentsService = new CommentsService()
  }
  async getComment(req: Request, res: Response) {
    const comment: CommentType | null = await this.commentsService.getCommentById(req.params.commentId);
    comment ? res.send(comment) : res.sendStatus(404);
  }

  async updateComment(req: Request, res: Response) {
    const commentToUpdate: CommentType | null = await this.commentsService.getCommentById(req.params.commentId);
    if (!commentToUpdate) return res.sendStatus(404);
    const isUpdated = await this.commentsService.updateComment(req.params.commentId, req.body.content);
    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }

  async deleteComment(req: Request, res: Response) {
    const commentToDelete = await this.commentsService.getCommentById(req.params.commentId);
    if (!commentToDelete) return res.sendStatus(404);
    if (commentToDelete.userId.toString() !== req.context.user._id.toString()) return res.sendStatus(403); //changed to _id and new ObjectId added
    const isDeleted = await this.commentsService.deleteComment(req.params.commentId);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
}

const commentsController = new CommentsController();

commentsRouter.get("/:commentId", commentsController.getComment.bind(commentsController));

commentsRouter.put(
  "/:commentId",
  authentication,
  userAuthorization,
  commentContentValidation,
  inputValidationMiddleware,
  commentsController.updateComment.bind(commentsController)
);

commentsRouter.delete("/:commentId", authentication, commentsController.deleteComment.bind(commentsController));
