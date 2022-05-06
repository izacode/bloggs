import { Router, Request, Response } from "express";
import { usersService } from "../domain/users-service";
import { authentication, authorization } from "../middleware/authMiddleware";
import { inputValidationMiddleware, userLoginValidation, userPasswordValidation } from "../middleware/inputValidation";
import { QueryType } from "../types/types";

export const usersRouter = Router();

usersRouter.get("/", async (req: Request, res: Response) => {
  const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
  const users = await usersService.getAllUsers(PageNumber, PageSize);
  res.json(users);
});

usersRouter.post(
  "/",
  authorization,
  userLoginValidation,
  userPasswordValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body.login, req.body.password);
    res.status(201).json(newUser);
  }
);
usersRouter.delete("/:id", authorization, async (req: Request, res: Response) => {
  const isDeleted = await usersService.deleteUser(req.params.id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
