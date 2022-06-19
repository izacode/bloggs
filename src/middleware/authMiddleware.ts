import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { jwtService } from "../application/jwt-service";
import { commentsService } from "../domain/comments-service";
import { usersService } from "../domain/users-service";
import { registrationIpCollection } from "../repositories/dbmongo";
import { CommentType, RegisterAttemptType } from "../types/types";
import sub from "date-fns/sub"
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
  debugger;
  if (userId) {
    req.context = {
      user: await usersService.findUserById(userId),
    };
    next();
    return;
  }
  res.sendStatus(401);
};
export const userAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  const commentToUpdate: CommentType | null = await commentsService.getCommentById(req.params.commentId);
  if (!commentToUpdate) return res.sendStatus(404);
  if (commentToUpdate.userId !== req.context.user.id) return res.sendStatus(403);
  next();
};



export const attemptsCheck = async (req: Request, res: Response, next: NextFunction) => {
  const ip: string = req.ip;
  const attemptDate: Date = new Date();
  const result = await registrationIpCollection.find({ ip }).toArray();
  if (result && result.length > 5 && result.filter(a=>a.attemptDate<sub(new Date(),{seconds: 10})))
    return res.sendStatus(429);
  const attempt: RegisterAttemptType = {
    ip,
    attemptDate,
  };
  await registrationIpCollection.insertOne(attempt);
  next()
};
