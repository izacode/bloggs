import { Router, Request, Response } from "express";
import { commentsService } from "../domain/comments-service";
import { authMiddleware } from "../middleware/authMiddleware";
import { contentValidation, inputValidationMiddleware } from "../middleware/inputValidation";

export const commentsRouter = Router();

commentsRouter.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  const comment = await commentsService.getCommentById(+req.params.id);
  res.status(201).send(comment);
});

commentsRouter.put("/:id",authMiddleware, contentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const isUpdated = await commentsService.updateComment(+req.params.id, req.body.content);
  isUpdated ? res.sendStatus(204) : res.sendStatus(404);
});

commentsRouter.delete("/:id", async (req: Request, res: Response) => {
  const isDeleted = await commentsService.deleteComment(+req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
