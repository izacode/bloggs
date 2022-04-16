import { Router, Request, Response, NextFunction } from "express";
import { postsService } from "../domain/posts-service";
import { body } from "express-validator";
import { inputValidationMiddleware } from "../middleware/inputValidation";
import { PostType } from "../repositories/db";

export const postsRouter = Router();

// Validatiion =====================================================================

const titleValidation = body("title")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Title is missing,please add, it should contain at least one character");
const shortDescriptionValidation = body("shortDescription")
  .trim()
  .isLength({ min: 1 })
  .withMessage("ShortDescription is missing,it should contain at least one character");
const contentValidation = body("content")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Content is missing,it should contain at least one character");
const bloggerIDValidation = body("bloggerID")
  .isInt({ gt: 0 })
  .withMessage("Invalid ID, it shoud be a number greater then 0,without symbols or letters");

// Routes ===========================================================================

postsRouter.get("/", async (req: Request, res: Response) => {
  const posts: PostType[] = await postsService.getAllPosts();
  res.json(posts);
});

postsRouter.post(
  "/",
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDValidation,

  inputValidationMiddleware,

  async (req: Request, res: Response) => {
    const createdPost = await postsService.createPost(req);
    return res.status(201).json(createdPost);
  }
);

postsRouter.get("/:id", async (req: Request, res: Response) => {
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

postsRouter.delete("/:id", async (req: Request, res: Response) => {
  const isDeleted = await postsService.deletePost(+req.params.id);
 
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
