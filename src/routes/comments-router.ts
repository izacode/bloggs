import e, { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { commentsService } from "../domain/comments-service";
import { authentication, userAuthorization } from "../middleware/authMiddleware";
import { commentContentValidation, contentValidation, inputValidationMiddleware } from "../middleware/inputValidation";
import { CommentType } from "../types/types";

export const commentsRouter = Router();

commentsRouter.get("/:commentId", async (req: Request, res: Response) => {
  const comment: CommentType | null = await commentsService.getCommentById(req.params.commentId);
  comment ? res.send(comment) : res.sendStatus(404);
});

commentsRouter.put(
  "/:commentId",
  authentication,
  userAuthorization,
  commentContentValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const commentToUpdate: CommentType | null = await commentsService.getCommentById(req.params.commentId);
    if (!commentToUpdate) return res.sendStatus(404);
    const isUpdated = await commentsService.updateComment(req.params.commentId, req.body.content);
    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

commentsRouter.delete("/:commentId", authentication, async (req: Request, res: Response) => {
  const commentToDelete = await commentsService.getCommentById(req.params.commentId);
  if (!commentToDelete) return res.sendStatus(404);
  console.log(commentToDelete.userId);
  console.log(req.context.user._id);
  if (commentToDelete.userId.toString() !== req.context.user._id.toString()) return res.sendStatus(403); //changed to _id and new ObjectId added
  const isDeleted = await commentsService.deleteComment(req.params.commentId);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
