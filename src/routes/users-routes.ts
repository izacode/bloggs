import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { authService } from "../domain/auth-service";
import { usersService } from "../domain/users-service";

import { authentication, authorization } from "../middleware/authMiddleware";
import { inputValidationMiddleware, userLoginValidation, userPasswordValidation } from "../middleware/inputValidation";
import { QueryType } from "../types/types";

export const usersRouter = Router();


usersRouter.get("/", async (req: Request, res: Response) => {
  const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
  const users = await usersService.getAllUsers(PageNumber, PageSize);
  res.send(users);
});

usersRouter.post(
  "/",

  userLoginValidation,
  userPasswordValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newUser = await authService.createUser(req.body.login, req.body.email, req.body.password, req.ip);
    res.status(201).json(newUser);
  }
);
usersRouter.delete("/:id", authorization, async (req: Request, res: Response) => {
  const _id: ObjectId = new ObjectId(req.params.id)
  const isDeleted = await usersService.deleteUser(_id);
  isDeleted ? res.sendStatus(204) : res.sendStatus(404);
});
