import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { jwtService } from "../application/jwt-service";
import { commentsService } from "../domain/comments-service";
import { usersService } from "../domain/users-service";
import {registrationIpCollection} from "../repositories/dbmongo";
import { CommentType, AttemptType } from "../types/types";
import sub from "date-fns/sub";
import { UsersRepository } from "../repositories/users-db-repository";

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
  debugger
  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);
  const userIdObject = new ObjectId(userId)
  if (userId) {
    req.context = {
      user: await usersService.findUserById(userIdObject),
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
  const url = req.url
  
  const attempt: AttemptType = {
    ip,
    attemptDate,
    url
  };
  await registrationIpCollection.insertOne(attempt);
  const nowMinusTenSec = sub(new Date(), { seconds: 10 })
  const result = await registrationIpCollection.countDocuments( {ip, attemptDate: { $gt: nowMinusTenSec }, url})
  if (result> 5) return res.sendStatus(429);
  next();
};



// export const resendEmailAttemptsCheck = async (req: Request, res: Response, next: NextFunction) => {
//   const ip: string = req.ip;
//   const attemptDate: Date = new Date();
//   const result = await resendEmailIpsCollection.find({ ip }).toArray();
//   if (result.filter((a) => a.attemptDate > sub(new Date(), { seconds: 10 })).length > 5) return res.sendStatus(429);
//   const attempt: RegisterAttemptType = {
//     ip,
//     attemptDate,
//   };
//   await resendEmailIpsCollection.insertOne(attempt);
//   next();
// };
// export const loginAttemptsCheck = async (req: Request, res: Response, next: NextFunction) => {
//   const ip: string = req.ip;
//   const attemptDate: Date = new Date();
//   const result = await loginIpsCollection.find({ ip }).toArray();

//   if (result.filter((a) => a.attemptDate > sub(new Date(), { seconds: 10 })).length > 5) return res.sendStatus(429);
//   const attempt: LoginAttemptType = {
//     ip,
//     attemptDate,
//   };
//   await loginIpsCollection.insertOne(attempt);
//   next();
// };

const usersRepository = new UsersRepository();

export const userExistsCheck = async (req: Request, res: Response, next: NextFunction) => {
  const userLoginExists = await usersRepository.findUserByLoginOrEmail(req.body.login);
  if (userLoginExists) return res.status(400).json({ errorsMessages: [{ message: "User with this login exists", field: "login" }] });
  const userEmailExists = await usersRepository.findUserByLoginOrEmail(req.body.email);
  if (userEmailExists) return res.status(400).json({ errorsMessages: [{ message: "User with this email exists", field: "email" }] });
  next();
};

export const isConfirmed = async (req: Request, res: Response, next: NextFunction) => {
  const user = await usersRepository.findUserByLoginOrEmail(req.body.email);
  if (!user) return next();
  if (user.emailConfirmation.isConfirmed)
    return res.status(400).json({ errorsMessages: [{ message: "User is confirmed", field: "email" }] });
  next();
};
export const isConfirmedCode = async (req: Request, res: Response, next: NextFunction) => {
  const user = await usersRepository.findUserByConfirmationCode(req.body.code);
  if (!user) return next();
  if (user.emailConfirmation.isConfirmed)
    return res.status(400).send({ errorsMessages: [{ message: "User is confirmed", field: "code" }] });
  next();
};

export const isEmailExists = async (req: Request, res: Response, next: NextFunction) => {
  const user = await usersRepository.findUserByLoginOrEmail(req.body.email);
  if (!user)
    return res.status(400).json({ errorsMessages: [{ message: "User doesn't exist", field: "email" }] });
  next();
};
export const requestCollect = async (req: Request, res: Response, next: NextFunction) => {
  
 
  const income = { requestIp: req.ip, requestBody: req.body, url: req.url, date: new Date() };

  const isAdded = usersRepository.saveRequests(income);
  if (!isAdded) return res.send("Could not save request");
  next();
};
