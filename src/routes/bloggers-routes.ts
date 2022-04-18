import { Router, Request, Response } from "express";
import { bloggersService } from "../domain/bloggers-service";
import { postsService } from "../domain/posts-service";
import {
  inputValidationMiddleware,
  queryValidation,
  bloggerIDBodyValidation,
  nameValidation,
  youtubeURIValidation,
  bloggerIDValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  postIDBodyValidation,
} from "../middleware/inputValidation";

export const bloggersRouter = Router();

//  Routes =====================================================================================================================

bloggersRouter.get("/p?", queryValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const pageNumber = req.query.p || 1;
  const pageSize = 10;
  const bloggers = await bloggersService.getAllBloggers(pageNumber, pageSize);
  res.json(bloggers);
});

bloggersRouter.post(
  "/",
  bloggerIDBodyValidation,
  nameValidation,
  youtubeURIValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlogger = await bloggersService.createBlogger(+req.body.id, req.body.name, req.body.youtubeURI);
    res.status(201).json(newBlogger);
  }
);

bloggersRouter.get("/:id", async (req: Request, res: Response) => {
  const blogger = await bloggersService.getBlogger(+req.params.id);
  blogger ? res.json(blogger) : res.sendStatus(404);
});

bloggersRouter.put(
  "/:id",
  bloggerIDValidation,
  nameValidation,
  youtubeURIValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const isdUpdated: boolean = await bloggersService.updateBlogger(+req.params.id, req.body.name, req.body.youtubeURI);
    isdUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }
);

bloggersRouter.delete("/:id", bloggerIDValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const isDeleted: boolean = await bloggersService.deleteBlogger(+req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});

bloggersRouter.get("/:bloggerId/posts", async (req: Request, res: Response) => {
  const pageNumber = req.query.p || 1;
  const pageSize = 10;
  const bloggerPosts = await bloggersService.getAllBloggerPosts(+req.params.bloggerId, pageNumber, pageSize);
  bloggerPosts ? res.json(bloggerPosts) : res.sendStatus(404);
});
bloggersRouter.post(
  "/:id/posts",
  bloggerIDValidation,
  postIDBodyValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newPost = await postsService.createPost(req);
    
    newPost ? res.status(201).json(newPost) : res.sendStatus(404);
  }
);
