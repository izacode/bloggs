import { Router, Request, Response } from "express";
import { bloggersService } from "../domain/bloggers-service";
import { body, param, query } from "express-validator";
import { inputValidationMiddleware } from "../middleware/inputValidation";

export const bloggersRouter = Router();

//  Inputs validations=========================================================================================================
const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;

const bloggerIDValidation = param("id")
  .trim()
  .isInt({ gt: 0 })
  .withMessage("Invalid ID, it shoud be a number greater then 0,without symbols or letters");

const bloggerIDBodyValidation = body("id")
  .trim()
  .isInt({ gt: 0 })
  .withMessage("Invalid ID!, it shoud be a number greater then 0,without symbols or letters");

const nameValidation = body("name")
  .trim()
  .isLength({ min: 1 })
  .withMessage("blogger name should contain at least one character");

const youtubeURIValidation = body("youtubeURI").trim().matches(re).withMessage("Invalid youtubeURI");
const queryValidation = query("p")
  .isInt({ gt: 0 })
  .withMessage("Invalid query, it shoud be a number greater then 0,without symbols or letters");

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
