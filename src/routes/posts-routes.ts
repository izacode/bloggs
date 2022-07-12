import { Router } from "express";
import { postsController } from "../composition-root";

import { authentication, authorization } from "../middleware/authMiddleware";

import {
  inputValidationMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  queryValidation,
  postIDValidation,
  bloggerIDBodyValidation,
  commentContentValidation,
} from "../middleware/inputValidation";



export const postsRouter = Router();



// Routes ===========================================================================

postsRouter.get("/", queryValidation, inputValidationMiddleware, postsController.getPosts.bind(postsController));

postsRouter.post(
  "/",
  authorization,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDBodyValidation,
  inputValidationMiddleware,
  postsController.createPost.bind(postsController)
);

postsRouter.get("/:id", postIDValidation, inputValidationMiddleware, postsController.getPost.bind(postsController));

postsRouter.put(
  "/:id",
  authorization,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDBodyValidation,
  inputValidationMiddleware,
  postsController.updatePost.bind(postsController)
);

postsRouter.delete("/:id", authorization, postIDValidation, inputValidationMiddleware, postsController.deletePost.bind(postsController));

// =============    Comments   =======================

postsRouter.get("/:id/comments", postsController.getPostComments.bind(postsController));

postsRouter.post("/:id/comments", authentication, commentContentValidation, inputValidationMiddleware, postsController.createPostComment.bind(postsController));
