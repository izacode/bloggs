import { Router, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { authService } from "../domain/auth-service";
// import { usersService } from "../domain/users-service";
import { inputValidationMiddleware, loginValidation, passwordValidation, testMiddleware, userLoginValidation, userPasswordValidation } from "../middleware/inputValidation";
import { UserAccountDBType, UserType } from "../types/types";

export const authRouter = Router();



authRouter.post("/registration", async (req:Request, res:Response) => {
  const user: UserAccountDBType | null = await authService.createUser(req.body.login, req.body.email, req.body.password)
  if(!user) res.sendStatus(400)
  res.status(201).send(user)
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const user:UserAccountDBType | null = await authService.checkCredentials(req.body.loginOrEmail, req.body.password);
  if (user) {
    const token = await jwtService.createJWT(user);
    res.send(token);
  } else {
    res.sendStatus(401);
  }
});

authRouter.post("/confirm-email", async (req:Request, res: Response) => {
  const result = await authService.confirmEmail(req.body.code)
  if(result) {
    res.status(201).json({
      status: "success",
      message: "Email has been confirmed"
    })
  } else {
    res.sendStatus(400)
  }
})
authRouter.post("/resend-registration-code", async (req: Request, res: Response) => {
  // TO DO
})

