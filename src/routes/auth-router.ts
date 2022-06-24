import { Router, Request, Response } from "express";

import { jwtService } from "../application/jwt-service";
import { authService } from "../domain/auth-service";
import { emailService } from "../domain/email-service";
import { usersService } from "../domain/users-service";
import { attemptsCheck, isConfirmed, isConfirmedCode, isEmailExists, userExistsCheck } from "../middleware/authMiddleware";
// import { usersService } from "../domain/users-service";
import {
  codeValidation,
  emailValidation,
  inputValidationMiddleware,
  loginValidation,
  passwordValidation,
  testMiddleware,
  userLoginValidation,
  userPasswordValidation,
} from "../middleware/inputValidation";
import { UserAccountDBType, UserType } from "../types/types";

export const authRouter = Router();

authRouter.post(
  "/registration",
  attemptsCheck,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidationMiddleware,
  
  userExistsCheck,

  async (req: Request, res: Response) => {
    const user: UserAccountDBType | null = await authService.createUser(req.body.login, req.body.email, req.body.password, req.ip);
    if (!user) return res.sendStatus(400);
    res.sendStatus(204);
  }
);

authRouter.post("/login", attemptsCheck, async (req: Request, res: Response) => {
  // const confirmedUser = await usersService.findUserByLogin(req.body.login);
  // if (!confirmedUser) return res.sendStatus(401);
  // if (!confirmedUser.emailConfirmation.isConfirmed) return res.status(400).json({ message: "Please confirm your email" });

  const user: UserAccountDBType | null = await authService.checkCredentials(req.body.login, req.body.password);
  if (user) {
    const accessToken: string = await jwtService.createJWT(user);
    // const refreshToken: string = await jwtService.createRefreshJWT(user);
    // const tokens = { accessToken, refreshToken };
    res.send({token:accessToken});
  } else {
    res.sendStatus(401);
  }
});
authRouter.post("/refreshtoken", async (req: Request, res: Response) => {
  const user: UserAccountDBType | null = await authService.checkCredentials(req.body.loginOrEmail, req.body.password);
  if (user) {
    const refreshToken: string = await jwtService.createRefreshJWT(user);
    const accessToken: string = await jwtService.createJWT(user);
    const tokens = { accessToken, refreshToken };
    res.send(tokens);
  } else {
    res.sendStatus(401);
  }
});

authRouter.post(
  "/registration-confirmation",
  codeValidation,
  inputValidationMiddleware,
  isConfirmedCode,
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);
    if (result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(400);
    }
  }
);
authRouter.post("/registration-email-resending",attemptsCheck, isConfirmed, isEmailExists,  async (req: Request, res: Response) => {

  const result = await authService.reConfirmEmail(req.body.email);
  if (!result) return res.sendStatus(400);
  res.sendStatus(204);
});

authRouter.post("/sendRecoveryPassword", async (req: Request, res: Response) => {
  const info = await emailService.recoverPassword(req.body.email);

  // res.sendStatus(200)
  res.send(info);
});
