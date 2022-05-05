import { Request, Response, NextFunction } from "express";
import { validationResult, body, param, query } from "express-validator";

// Blogger validation ==============================================================================================================

const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;

export const bloggerIDValidation = param("id")
  .trim()
  .isInt({ gt: 0 })
  .withMessage("Invalid query bloggerID, it shoud be a number greater then 0,without symbols or letters");

export const bloggerIDBodyValidation = body("id")
  .trim()
  .isInt({ gt: 0 })
  .withMessage("Invalid ID!, it shoud be a number greater then 0,without symbols or letters");

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

    res.status(400).json({ errorsMessages: myErrors, resultCode: 1 });
  }
};
export const bloggerIdError = {
  message: "invalid bloggerId or blogger doesn't exists",
  field: "bloggerId",
};