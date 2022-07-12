import { Router} from "express";
import { usersController } from "../composition-root";
import { authorization } from "../middleware/authMiddleware";
import { inputValidationMiddleware, userLoginValidation, userPasswordValidation } from "../middleware/inputValidation";


export const usersRouter = Router();


usersRouter.get("/", usersController.getUsers.bind(usersController));
usersRouter.post(
  "/",
  userLoginValidation,
  userPasswordValidation,
  inputValidationMiddleware,
  usersController.createUser.bind(usersController)
);
usersRouter.delete("/:id", authorization, usersController.deleteUser.bind(usersController));
