import { Router, Request, Response } from "express";
import { commentsService } from "../domain/comments-service";
import { authentication } from "../middleware/authMiddleware";
import { commentContentValidation, contentValidation, inputValidationMiddleware, } from "../middleware/inputValidation";
import { CommentType } from "../types/types";

export const commentsRouter = Router();

commentsRouter.get("/:commentId",  async (req: Request, res: Response) => {
  const comment: CommentType | null = await commentsService.getCommentById(req.params.commentId);
  comment ? res.send(comment) : res.sendStatus(404);
});

commentsRouter.put(
  "/:commentId",
  authentication,
  commentContentValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const commentToUpdate = await commentsService.getCommentById(req.params.commentId);
    if (!commentToUpdate) return res.sendStatus(404);
    if (commentToUpdate.userId !== req.context.user.id) return res.sendStatus(403);
    const isUpdated = await commentsService.updateComment(req.params.commentId, req.body.content);
    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

commentsRouter.delete("/:commentId", authentication, async (req: Request, res: Response) => {
  const commentToDelete = await commentsService.getCommentById(req.params.commentId);
  if (!commentToDelete) return res.sendStatus(404);
  if (commentToDelete.userId.toString() !== req.context.user.id) return res.sendStatus(403);
  const isDeleted = await commentsService.deleteComment(req.params.commentId);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
  