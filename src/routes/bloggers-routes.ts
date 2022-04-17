import { Router, Request, Response } from "express";
import { bloggersService } from "../domain/bloggers-service";
import { body, param, query } from "express-validator";
import { inputValidationMiddleware } from "../middleware/inputValidation";

export const bloggersRouter = Router();

//  Inputs validations=========================================================================================================
const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;

const bloggerIDValidation = param("id")
  .isInt({ gt: 0 })
  .withMessage("Invalid ID, it shoud be a number greater then 0,without symbols or letters");

const nameValidation = body("name")
  .trim()
  .isLength({ min: 1 })
  .withMessage("blogger name should contain at least one character");

const youtubeURIValidation = body("youtubeURI").trim().matches(re).withMessage("Invalid youtubeURI");
const queryValidation = query("p")
  .toInt()
  .isInt({ gt: 0 })
  .withMessage("Invalid query, it shoud be a number greater then 0,without symbols or letters");

//  Routes =====================================================================================================================

bloggersRouter.get("/",queryValidation,inputValidationMiddleware, async (req: Request, res: Response) => {
  // console.log("p check: ",+req.query.p)
  const pageNumber = req.query.p || 1;
  const pageSize = 4;
  const bloggers = await bloggersService.getAllBloggers(pageNumber, pageSize);
  res.json(bloggers);
});

bloggersRouter.post(
  "/",
  nameValidation,
  youtubeURIValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeURI);
    res.json(newBlogger);
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

bloggersRouter.delete("/:id", async (req: Request, res: Response) => {
  const isDeleted: boolean = await bloggersService.deleteBlogger(+req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
