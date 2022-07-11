import { Router, Request, Response } from "express";
import { JwtService } from "../application/jwt-service";
import { AuthService} from "../domain/auth-service";
import { EmailService } from "../domain/email-service";
import { attemptsCheck, authentication, isConfirmed, isConfirmedCode, isEmailExists, userExistsCheck } from "../middleware/authMiddleware";
import {
  codeValidation,
  emailValidation,
  inputValidationMiddleware,
  loginValidation,
  passwordValidation,
} from "../middleware/inputValidation";
import { UserAccountDBType } from "../types/types";

export const authRouter = Router();

class AuthController {

  authService: AuthService
  jwtService: JwtService
  emailService: EmailService


  constructor(){
    this.authService = new AuthService(),
    this.jwtService = new JwtService(),
    this.emailService = new EmailService()
  }

    

  async registerUser(req: Request, res: Response) {
    const user: UserAccountDBType | null = await this.authService.createUser(req.body.login, req.body.email, req.body.password, req.ip);
    if (!user) return res.sendStatus(400);
    res.sendStatus(204);
  }

  async loginUser(req: Request, res: Response) {
    const user: UserAccountDBType | null = await this.authService.checkCredentials(req.body.login, req.body.password);
    if (!user) return res.sendStatus(401);
    const accessToken: string = await this.jwtService.createJWT(user);
    const refreshToken: string = await this.jwtService.createRefreshJWT(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.send({
      accessToken,
    });
  }

  async refreshTokens(req: Request, res: Response) {
    let cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    const result = await this.jwtService.checkRefreshToken(refreshToken);
    if (!result) return res.sendStatus(401);
    const accessToken: string = await this.jwtService.createJWT(result);
    const newRefreshToken: string = await this.jwtService.createRefreshJWT(result);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send({ accessToken });
  }

  async logoutUser(req: Request, res: Response) {
    let cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    const result = await this.jwtService.checkRefreshToken(refreshToken);
    if (!result) return res.sendStatus(401);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    res.sendStatus(204);
  }

  async confirmRegistration(req: Request, res: Response) {
    const result = await this.authService.confirmEmail(req.body.code);
    if (result) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(400);
    }
  }

  async resendConfirmaitionEmail(req: Request, res: Response) {
    const result = await this.authService.reConfirmEmail(req.body.email);
    if (!result) return res.sendStatus(400);
    res.sendStatus(204);
  }

  async sendRecoveryPassword(req: Request, res: Response) {
    const info = await this.emailService.recoverPassword(req.body.email);
    res.send(info);
  }

  async showUserInfo(req: Request, res: Response) {
    const user = req.context.user;
    if (!user) return res.sendStatus(401);
    const userInfo = {
      email: user.accountData.email,
      login: user.accountData.userName,
      userId: user._id,
    };
    res.send(userInfo);
  }
}

const authController = new AuthController();

authRouter.post(
  "/registration",
  attemptsCheck,
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidationMiddleware,
  userExistsCheck,
  authController.registerUser.bind(authController)
);

authRouter.post("/login", attemptsCheck, loginValidation, passwordValidation, inputValidationMiddleware, authController.loginUser.bind(authController));
authRouter.post("/refresh-token", authController.refreshTokens.bind(authController));
authRouter.post("/logout", authController.logoutUser.bind(authController));

authRouter.post(
  "/registration-confirmation",
  codeValidation,
  inputValidationMiddleware,
  isConfirmedCode,
  authController.confirmRegistration.bind(authController)
);

authRouter.post("/registration-email-resending", attemptsCheck, isConfirmed, isEmailExists, authController.resendConfirmaitionEmail.bind(authController));
authRouter.post("/sendRecoveryPassword", authController.sendRecoveryPassword.bind(authController));
// authRouter.post("/me", authentication, authController.showUserInfo);
authRouter.get("/me", authentication, authController.showUserInfo.bind(authController));
