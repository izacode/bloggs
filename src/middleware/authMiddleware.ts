import { Request, Response, NextFunction } from "express";

export const checkCredentials = (req: Request, res: Response, next: NextFunction) => {
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
