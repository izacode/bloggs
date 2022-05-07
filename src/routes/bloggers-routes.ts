import { Router, Request, Response } from "express";
import { bloggersService } from "../domain/bloggers-service";
import { postsService } from "../domain/posts-service";
import { QueryType } from "../types/types";
import {
  inputValidationMiddleware,
  nameValidation,
  youtubeURIValidation,
  bloggerIDValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIdQueryValidation,
} from "../middleware/inputValidation";
import { authorization } from "../middleware/authMiddleware";

export const bloggersRouter = Router();

//  Routes =====================================================================================================================

bloggersRouter.get("/", async (req: Request, res: Response) => {
  const { SearchNameTerm = null, PageNumber = 1, PageSize = 10 } = req.query as QueryType;
  const bloggers = await bloggersService.getAllBloggers(SearchNameTerm, PageNumber, PageSize);
  res.json(bloggers);
});

bloggersRouter.post(
  "/",
  authorization,
  nameValidation,
  youtubeURIValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const { name, youtubeUrl } = req.body;
    const newBlogger = await bloggersService.createBlogger(name, youtubeUrl);
    res.status(201).json(newBlogger);
  }
);

bloggersRouter.get("/:id", async (req: Request, res: Response) => {
  const blogger = await bloggersService.getBlogger(req.params.id);
  blogger ? res.json(blogger) : res.sendStatus(404);
});

bloggersRouter.put(
  "/:id",
  authorization,
  nameValidation,
  youtubeURIValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const isdUpdated: boolean = await bloggersService.updateBlogger(req.params.id, req.body.name, req.body.youtubeUrl);
    isdUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

bloggersRouter.delete("/:id", authorization, async (req: Request, res: Response) => {
  const isDeleted: boolean = await bloggersService.deleteBlogger(req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});

bloggersRouter.get("/:bloggerId/posts", async (req: Request, res: Response) => {
  const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
  const bloggerPosts = await bloggersService.getAllBloggerPosts(req.params.bloggerId, PageNumber, PageSize);
  bloggerPosts ? res.json(bloggerPosts) : res.sendStatus(404);
});

bloggersRouter.post(
  "/:bloggerId/posts",
  authorization,

  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const { body, params } = req;
    const newPost = await postsService.createPost(body, params);

    newPost ? res.status(201).json(newPost) : res.sendStatus(404);
  }
);
