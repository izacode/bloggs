import { Router, Request, Response } from "express";
import { commentsService } from "../domain/comments-service";
import { authentication } from "../middleware/authMiddleware";
import { contentValidation, inputValidationMiddleware, mongoIdValidation } from "../middleware/inputValidation";
import { CommentType } from "../types/types";

export const commentsRouter = Router();

commentsRouter.get("/:id", mongoIdValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const comment: CommentType | null = await commentsService.getCommentById(req.params.id);
  comment ? res.send(comment) : res.sendStatus(404);
});

commentsRouter.put("/:id", authentication, contentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const commentToUpdate = await commentsService.getCommentById(req.params.id);
  if (!commentToUpdate) return res.sendStatus(404);
  if (commentToUpdate.userId.toString() !== req.context.user.id) return res.sendStatus(403);
  const isUpdated = await commentsService.updateComment(req.params.id, req.body.content);
  isUpdated ? res.sendStatus(204) : res.sendStatus(404);
});

commentsRouter.delete("/:id", authentication, async (req: Request, res: Response) => {
  const commentToDelete = await commentsService.getCommentById(req.params.id);
  if (!commentToDelete) return res.sendStatus(404);
  if (commentToDelete.userId !== req.context.user.id) return res.sendStatus(403);
  const isDeleted = await commentsService.deleteComment(req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
