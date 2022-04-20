import { Router, Request, Response} from "express";
import { postsService } from "../domain/posts-service";

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


export const postsRouter = Router();


// Routes ===========================================================================

postsRouter.get("/", queryValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const SearchTitleTerm = req.query.titleSearch || null;
  const pageNumber = req.query.PageNumber || 1;
  const pageSize = req.query.PageSize || 10;
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
    const createdPost = await postsService.createPost(req);
    return res.status(201).json(createdPost);
  }
);

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
