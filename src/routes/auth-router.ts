import { Router, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { authService } from "../domain/auth-service";
import { emailService } from "../domain/email-service";
import { attemptsCheck, isConfirmed, isConfirmedCode, isEmailExists, userExistsCheck } from "../middleware/authMiddleware";
import {
  codeValidation,
  emailValidation,
  inputValidationMiddleware,
  loginValidation,
  passwordValidation,
} from "../middleware/inputValidation";
import { UserAccountDBType } from "../types/types";

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
    debugger;
    const user: UserAccountDBType | null = await authService.createUser(req.body.login, req.body.email, req.body.password, req.ip);
    if (!user) return res.sendStatus(400);
    res.sendStatus(204);
  }
);

authRouter.post(
  "/login",
  attemptsCheck,
  loginValidation,
  passwordValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    // const confirmedUser = await usersService.findUserByLogin(req.body.login);
    // if (!confirmedUser) return res.sendStatus(401);
    // if (!confirmedUser.emailConfirmation.isConfirmed) return res.status(400).json({ message: "Please confirm your email" });
    
    const user: UserAccountDBType | null = await authService.checkCredentials(req.body.login, req.body.password);
    if (user) {
      const accessToken: string = await jwtService.createJWT(user);
      const refreshToken: string = await jwtService.createRefreshJWT(user);
      res.cookie("rjwt", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true,
      });
      res.send({ token: accessToken });
    } else {
      res.sendStatus(401);
    }
  }
);
authRouter.post("/refresh-token", async (req: Request, res: Response) => {
  let cookies = req.cookies;
  if (!cookies?.rjwt) return res.sendStatus(401);
  const refreshToken = cookies.rjwt;
  const result = await jwtService.checkRefreshToken(refreshToken);
  if(!result) return res.sendStatus(401)
  const accessToken: string = await jwtService.createJWT(result);
  const newRefreshToken: string = await jwtService.createRefreshJWT(result);
  res.cookie("rjwt", newRefreshToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: true,
  });
  return res.send({ token: accessToken });
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  let cookies = req.cookies;
  if (!cookies?.rjwt) return res.sendStatus(401);
  const refreshToken = cookies.rjwt;
  const result = await jwtService.checkRefreshToken(refreshToken);
  if(!result)res.sendStatus(401)
  res.clearCookie("rjwt", {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: true,
  });
  res.sendStatus(204)
});

authRouter.post(
  "/registration-confirmation",
  codeValidation,
  inputValidationMiddleware,
  isConfirmedCode,
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);
    if (result) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(400);
    }
  }
);
authRouter.post("/registration-email-resending", attemptsCheck, isConfirmed, isEmailExists, async (req: Request, res: Response) => {
  const result = await authService.reConfirmEmail(req.body.email);
  if (!result) return res.sendStatus(400);
  res.sendStatus(204);
});

authRouter.post("/sendRecoveryPassword", async (req: Request, res: Response) => {
  const info = await emailService.recoverPassword(req.body.email);
  res.send(info);
});
authRouter.get("/me", async (req: Request, res: Response) => {
 let cookies = req.cookies;
 if (!cookies?.rjwt) return res.sendStatus(401);
 const refreshToken = cookies.rjwt;
 const result = await jwtService.checkRefreshToken(refreshToken);
 if (!result) return res.sendStatus(401);
 const userInfo = 
 {
  email: result.accountData.email,
  login: result.accountData.userName,
  userId: result._id
 }
 res.send(userInfo);
});
