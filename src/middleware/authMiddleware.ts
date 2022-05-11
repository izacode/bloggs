import { Request, Response, NextFunction } from "express";
import { jwtService } from "../application/jwt-service";
import { commentsService } from "../domain/comments-service";
import { usersService } from "../domain/users-service";
import { CommentType } from "../types/types";
export const authorization = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) return res.sendStatus(401);
  const authorizationType = req.headers.authorization.split(" ")[0];
  const authorization = req.headers.authorization.split(" ")[1];
  const buff = Buffer.from(authorization, "base64");
  const decodedAuth = buff.toString("utf-8");
  const login = decodedAuth.split(":")[0];
  const password = decodedAuth.split(":")[1];
  if (login !== "admin" || password !== "qwerty" || authorizationType !== "Basic") return res.sendStatus(401);
  next();
};
export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);

  if (userId) {
    req.context = {
      user: await usersService.findUserById(userId),
    };
    next();
    return;
  }
  res.sendStatus(401);
};
export const userAuthorization = async (req:Request, res:Response, next:NextFunction)=> {
  const commentToUpdate: CommentType | null = await commentsService.getCommentById(req.params.commentId);
  if (!commentToUpdate) return res.sendStatus(404);
  if (commentToUpdate.userId !== req.context.user.id) return res.sendStatus(403);
  next()
}
