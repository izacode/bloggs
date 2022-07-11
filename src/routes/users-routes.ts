import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { AuthService } from "../domain/auth-service";
import { UsersService } from "../domain/users-service";

import { authentication, authorization } from "../middleware/authMiddleware";
import { inputValidationMiddleware, userLoginValidation, userPasswordValidation } from "../middleware/inputValidation";
import { QueryType } from "../types/types";

export const usersRouter = Router();

class UsersController {
  authService: AuthService
  usersService: UsersService
  constructor(){
    this.authService = new AuthService()
    this.usersService = new UsersService()
  }
  async getUsers(req: Request, res: Response) {
    const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
    const users = await this.usersService.getAllUsers(PageNumber, PageSize);
    res.send(users);
  }

  async createUser(req: Request, res: Response) {
    const createdUser = await this.authService.createUser(req.body.login, req.body.email, req.body.password, req.ip);
    if (!createdUser) return res.sendStatus(400);
    const newUser = {
      id: createdUser._id,
      login: createdUser.accountData.userName,
    };
    res.status(201).json(newUser);
  }

  async deleteUser(req: Request, res: Response) {
    const _id: ObjectId = new ObjectId(req.params.id);
    const isDeleted = await this.usersService.deleteUser(_id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }
}

const usersController = new UsersController();

usersRouter.get("/", usersController.getUsers.bind(usersController));

usersRouter.post(
  "/",
  userLoginValidation,
  userPasswordValidation,
  inputValidationMiddleware,
  usersController.createUser.bind(usersController)
);
usersRouter.delete("/:id", authorization, usersController.deleteUser.bind(usersController));
