import { Router, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { inputValidationMiddleware, loginValidation, passwordValidation, testMiddleware, userLoginValidation, userPasswordValidation } from "../middleware/inputValidation";
import { UserType } from "../types/types";

export const authRouter = Router();

authRouter.post("/login", loginValidation, passwordValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const user: UserType | null = await usersService.checkCredentials(req.body.login, req.body.password);
  if (!user) {
    res.sendStatus(401);
  } else {
    const token = await jwtService.createJWT(user);
    res.send(token);
  }
});
