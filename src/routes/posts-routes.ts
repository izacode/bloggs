import { Router, Request, Response, NextFunction } from "express";
import { postsHandlers, error, ErrorType } from "../repositories/posts-repository";
import { body } from "express-validator";
import { inputValidationMiddleware } from "../middleware/inputValidation";


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

postsRouter.get("/", (req: Request, res: Response) => {
  const posts = postsHandlers.getAllPosts();
  res.json(posts);
});

postsRouter.post(
  "/",
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDValidation,

  inputValidationMiddleware,

  (req: Request, res: Response) => {
    const newPost = postsHandlers.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerID);
    res.status(201).json(newPost);
  }
);

postsRouter.get("/:id", (req: Request, res: Response) => {
  const post = postsHandlers.getPost(+req.params.id);
  res.send(post);
});

postsRouter.put(
  "/:id",

  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDValidation,

  inputValidationMiddleware,

  (req: Request, res: Response) => {
    const updatedPost = postsHandlers.updatePost(
      +req.params.id,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.bloggerID
    );
    res.status(200).json(updatedPost);
  }
);

postsRouter.delete("/:id", (req: Request, res: Response) => {
  const deletedPost = postsHandlers.deletePost(+req.params.id);
  if(deletedPost===error){
    res.status(404).json(error)
    return;
  }
  res.status(200).json(deletedPost);
});
