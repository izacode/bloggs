import { Router} from "express";
import { commentsController } from "../composition-root";
import { authentication, userAuthorization } from "../middleware/authMiddleware";
import { commentContentValidation, inputValidationMiddleware } from "../middleware/inputValidation";


export const commentsRouter = Router();

commentsRouter.get("/:commentId", commentsController.getComment.bind(commentsController));

commentsRouter.put(
  "/:commentId",
  authentication,
  userAuthorization,
  commentContentValidation,
  inputValidationMiddleware,
  commentsController.updateComment.bind(commentsController)
);

commentsRouter.delete("/:commentId", authentication, commentsController.deleteComment.bind(commentsController));
