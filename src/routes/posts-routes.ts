import { Router, Request, Response } from "express";
import { commentsService } from "../domain/comments-service";
import { postsService } from "../domain/posts-service";
import { authMiddleware } from "../middleware/authMiddleware";

import {
  inputValidationMiddleware,
  postIDBodyValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDValidation,
  queryValidation,
  postIDValidation,
} from "../middleware/inputValidation";
import { QueryType } from "../types/types";

export const postsRouter = Router();

// Routes ===========================================================================

postsRouter.get("/", queryValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const { SearchTitleTerm = null, pageNumber = 1, pageSize = 10 } = req.query as QueryType;

  const posts = await postsService.getAllPosts(SearchTitleTerm, pageNumber, pageSize);
  res.json(posts);
});

postsRouter.post(
  "/",
  postIDBodyValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,

  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    const { body, params } = req;
    const createdPost = await postsService.createPost(body, params);
    return res.status(201).json(createdPost);
  }
);

postsRouter.get("/:id/comments", async (req: Request, res: Response) => {

  const {pageNumber,pageSize}= req.query as QueryType
  const post = await postsService.getPost(+req.params.id);
  if (!post) return res.sendStatus(404);
  const postComments = await commentsService.getAllPostComments(post.id!);
  res.send(postComments);
});

postsRouter.post("/:id/comments", authMiddleware, async (req: Request, res: Response) => {
  const post = await postsService.getPost(+req.params.id);
  if (!post) return res.sendStatus(404);
  const newComment = await commentsService.createComment(+req.params.id, req.body.content, req.context.user!._id, req.context.user!.login);
  res.status(201).send(newComment);
});

postsRouter.get("/:id", postIDValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const post = await postsService.getPost(+req.params.id);
  post ? res.json(post) : res.sendStatus(404);
});

postsRouter.put(
  "/:id",

  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDValidation,
  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    const isUpdated: boolean = await postsService.updatePost(
      +req.params.id,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.bloggerID
    );

    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

postsRouter.delete("/:id", postIDValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const isDeleted = await postsService.deletePost(+req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
