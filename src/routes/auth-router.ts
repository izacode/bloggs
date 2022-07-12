import { Router} from "express";
import { authController } from "../composition-root"
import { attemptsCheck, authentication, isConfirmed, isConfirmedCode, isEmailExists, userExistsCheck } from "../middleware/authMiddleware";
import {
  codeValidation,
  emailValidation,
  inputValidationMiddleware,
  loginValidation,
  passwordValidation,
} from "../middleware/inputValidation";


export const authRouter = Router();

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
authRouter.get("/me", authentication, authController.showUserInfo.bind(authController));
