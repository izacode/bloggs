import { Request, Response, NextFunction } from "express";
import { validationResult, body, param, query } from "express-validator";
import { UsersRepository } from "../repositories/users-db-repository";

// Comment validation ==============================================================================================================
// export const mongoIdValidation = param("id")
//   .trim()
//   .matches(/^[a-z0-9]{24}$/, "i")
//   .withMessage("Id should be of Mongo Id type, 24 charachters,lowercase latin letters and numbers");

// Blogger validation ==============================================================================================================

const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;
const regexForEmail = /^[\w\.]+@([\w]+\.)+[\w]{2,4}$/;

export const bloggerIDValidation = param("id").trim().isLength({ min: 13, max: 13 }).withMessage("Invalid query bloggerId");
export const bloggerIdQueryValidation = param("bloggerId").trim().isLength({ min: 13, max: 13 }).withMessage("Invalid query bloggerId");

export const bloggerIDBodyValidation = body("bloggerId")
  .trim()
  .isInt({ gt: 0 })
  .isLength({ min: 13 })
  .withMessage("Invalid BloggerId !!bloggerIDBodyValidation");

export const nameValidation = body("name")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("blogger name should contain at least one character");

export const youtubeURIValidation = body("youtubeUrl").trim().isLength({ max: 100 }).matches(re).withMessage("Invalid youtubeUrl");
export const queryValidation = query("p")
  .isInt({ gt: 0 })
  .withMessage("Invalid query, it shoud be a number greater then 0,without symbols or letters");

// Post validation ==============================================================================================================

export const postIDValidation = param("id")
  .trim()
  .isInt({ gt: 0 })
  .withMessage("Invalid ID, it shoud be a number greater then 0,without symbols or letters");

export const postIDBodyValidation = body("id")
  .trim()
  .isInt({ gt: 0 })
  .withMessage("Invalid ID, it shoud be a number greater then 0,without symbols or letters");

export const titleValidation = body("title").trim().isLength({ min: 1, max: 30 }).withMessage("Title should be from 1 to 30 charachters");
export const shortDescriptionValidation = body("shortDescription")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("ShortDescription is missing,it should contain at least one character");
export const contentValidation = body("content")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Content is missing,it should contain at least one character");
export const commentContentValidation = body("content")
  .trim()
  .isLength({ min: 20, max: 100 })
  .withMessage("Content should be from 20 to 100 characters");
export const userLoginValidation = body("login")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Login should be at least 3 charachters long, and up to 10");

export const userPasswordValidation = body("password")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Password should be from 6 to 20 charachters long");
export const loginValidation = body("login")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Login should be at least 3 charachters long, and up to 10");

export const passwordValidation = body("password")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Password should be from 6 to 20 charachters long");
// ==============================================================================================================
export const emailValidation = body("email").trim().matches(regexForEmail).withMessage("Invalid email");
export const codeValidation = body("code").trim().isString().isLength({ min: 20 });

// ==============================================================================================================

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty() || (errors.array()[0].param === "p" && errors.array()[0].value === undefined)) {
    next();
  } else {
    const myErrors = errors.array().map((e) => {
      return {
        message: e.msg,
        field: e.param,
      };
    });

    res.status(400).json({ errorsMessages: myErrors });
  }
};
export const bloggerIdError = {
  errorsMessages: [
    {
      message: "invalid bloggerId or blogger doesn't exists",
      field: "bloggerId",
    },
  ],
  resultCode: 1,
};

export const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("Inside test middleware");
  next();
};
