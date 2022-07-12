import { Router } from "express";

import {
  nameValidation,
  youtubeURIValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
} from "../middleware/inputValidation";
import { authorization } from "../middleware/authMiddleware";
import { bloggersController } from "../composition-root";

export const bloggersRouter = Router();

bloggersRouter.get("/", bloggersController.getBloggers);
bloggersRouter.post("/", authorization, nameValidation, youtubeURIValidation, inputValidationMiddleware, bloggersController.createBlogger);
bloggersRouter.get("/:id", bloggersController.getBlogger);
bloggersRouter.put(
  "/:id",
  authorization,
  nameValidation,
  youtubeURIValidation,
  inputValidationMiddleware,
  bloggersController.updateBlogger
);
bloggersRouter.delete("/:id", authorization, bloggersController.deleteBlogger);
bloggersRouter.get("/:bloggerId/posts", bloggersController.getBloggerPosts);
bloggersRouter.get("/:bloggerId/posts", bloggersController.createBloggerPost);

bloggersRouter.post(
  "/:bloggerId/posts",
  authorization,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
  bloggersController.createBloggerPost
);
