import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { authService } from "../domain/auth-service";
import { usersService } from "../domain/users-service";

import { authentication, authorization } from "../middleware/authMiddleware";
import { inputValidationMiddleware, userLoginValidation, userPasswordValidation } from "../middleware/inputValidation";
import { QueryType } from "../types/types";

export const usersRouter = Router();

class UsersController {
  async getUsers(req: Request, res: Response) {
    const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
    const users = await usersService.getAllUsers(PageNumber, PageSize);
    res.send(users);
  }

  async createUser(req: Request, res: Response) {
    const createdUser = await authService.createUser(req.body.login, req.body.email, req.body.password, req.ip);
    if (!createdUser) return res.sendStatus(400);
    const newUser = {
      id: createdUser._id,
      login: createdUser.accountData.userName,
    };
    res.status(201).json(newUser);
  }

  async deleteUser(req: Request, res: Response) {
    const _id: ObjectId = new ObjectId(req.params.id);
    const isDeleted = await usersService.deleteUser(_id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
}

const usersController = new UsersController();

usersRouter.get("/", usersController.getUsers);

usersRouter.post(
  "/",
  userLoginValidation,
  userPasswordValidation,
  inputValidationMiddleware,
  usersController.createUser
);
usersRouter.delete("/:id", authorization, usersController.deleteUser);
