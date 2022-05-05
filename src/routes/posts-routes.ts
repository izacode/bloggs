import { Router, Request, Response } from "express";
import { postsService } from "../domain/posts-service";
import { checkCredentials } from "../middleware/authMiddleware";

import {
  inputValidationMiddleware,
  postIDBodyValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDValidation,
  queryValidation,
  postIDValidation,
  bloggerIdError,
  bloggerIDBodyValidation,
} from "../middleware/inputValidation";
import { GetPostsQueryType } from "../types/types";


export const postsRouter = Router();

// Routes ===========================================================================


postsRouter.get("/", queryValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const { SearchTitleTerm = null, PageNumber = 1, PageSize = 10 } = req.query as GetPostsQueryType;

  const posts = await postsService.getAllPosts(SearchTitleTerm, PageNumber, PageSize);
  res.json(posts);
});

postsRouter.post(
  "/",
  checkCredentials,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,

  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    const {body,params} =req
    const createdPost = await postsService.createPost(body, params);
    createdPost ? res.status(201).json(createdPost) : res.status(404).json(bloggerIdError);
  }
);

postsRouter.get("/:id", postIDValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const post = await postsService.getPost(+req.params.id);
  post ? res.json(post) : res.sendStatus(404);
});


postsRouter.put(
  "/:id",
  checkCredentials,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDBodyValidation,
  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    debugger;
    const isUpdated: boolean = await postsService.updatePost(
      +req.params.id,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      +req.body.bloggerId
    );

    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

postsRouter.delete("/:id", checkCredentials, postIDValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const isDeleted = await postsService.deletePost(+req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
