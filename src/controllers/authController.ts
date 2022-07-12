import { Request, Response } from "express";
import { JwtService } from "../application/jwt-service";
import { AuthService } from "../domain/auth-service";
import { EmailService } from "../domain/email-service";
import { UsersService } from "../domain/users-service";
import { UserAccountDBType } from "../types/types";

export class AuthController {
  constructor(
    protected authService: AuthService,
    protected jwtService: JwtService,
    protected emailService: EmailService,
    protected usersService: UsersService
  ) {}

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

    const _id = await this.jwtService.getUserIdByRefreshToken(refreshToken);
    const isRevoked = await this.usersService.checkTokenList(refreshToken, _id);
    if (isRevoked) res.sendStatus(401);
    await this.usersService.updateTokenList(refreshToken, _id);

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
    const _id = await this.jwtService.getUserIdByRefreshToken(refreshToken);
    const isRevoked = await this.usersService.checkTokenList(refreshToken, _id);
    if (isRevoked) res.sendStatus(401);
    const result = await this.jwtService.checkRefreshToken(refreshToken);
    if (!result) return res.sendStatus(401);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    await this.usersService.updateTokenList(refreshToken, _id);

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
