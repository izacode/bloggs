import { Router, Request, Response } from "express";
import { commentsService } from "../domain/comments-service";
import { authMiddleware } from "../middleware/authMiddleware";

export const commentsRouter = Router();

commentsRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
  const newComment = await commentsService.createComment(req.body.content, req.context.user!._id);
  res.status(201).send(newComment);
});
