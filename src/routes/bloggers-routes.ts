import { Router, Request, Response } from "express";
import { bloggersRepository, error } from "../repositories/bloggers-repository";
import { body, param } from "express-validator";
import { inputValidationMiddleware } from "../middleware/inputValidation";

export const bloggersRouter = Router();
const errorCheck = (value: any, res: Response) => {
  if (value.hasOwnProperty("error")) {
    return res.status(400).json(value);
  } else {
    return res.status(201).json(value);
  }
};

const bloggerIDValidation = param("id")
  .isInt({ gt: 0 })
  .withMessage("Invalid ID, it shoud be a number greater then 0,without symbols or letters");

const nameValidation = body("name").trim().isLength({ min: 1 }).withMessage("blogger name should contain at least one character");

bloggersRouter.get("/", (req: Request, res: Response) => {
  const bloggers = bloggersRepository.getAllBloggers();
  res.json(bloggers);
});

bloggersRouter.post("/", nameValidation, inputValidationMiddleware, (req: Request, res: Response) => {
  const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeURI);
  errorCheck(newBlogger, res);
});

bloggersRouter.get("/:id", (req: Request, res: Response) => {
  const blogger = bloggersRepository.getBlogger(+req.params.id);
  res.json(blogger);
});

bloggersRouter.put("/:id", bloggerIDValidation, nameValidation, inputValidationMiddleware, (req: Request, res: Response) => {
  const updatedBlogger = bloggersRepository.updateBlogger(+req.params.id, req.body.name, req.body.youtubeURI);

  errorCheck(updatedBlogger, res);
});

bloggersRouter.delete("/:id", (req: Request, res: Response) => {
  const bloggers = bloggersRepository.deleteBlogger(+req.params.id);
  errorCheck(bloggers, res);
});
