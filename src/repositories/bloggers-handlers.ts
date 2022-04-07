import { Request, Response } from "express";


import { BloggerType, bloggers } from "./db";

type ErrorType = {
  data: {
    id?: number;
    name?: string;
    youtubeURI?: string;
    title?: string;
    shortDescription?: string;
    content?: string;
    bloggerID?: string;
    bloggerName?: string;
  };
  errorMessage: {
    message?: string;
    field?: string;
  };
  resultCode: number;
};

let error: ErrorType = {
  data: {},
  errorMessage: {},
  resultCode: 0,
};

const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;

const isValidYoutubeURI = (field: string, regex: any) => {
  return regex.test(field);
};

export const bloggersHandlers = {
  getAllBloggers(req: Request, res: Response) {
    res.json(bloggers);
  },
  getBlogger(req: Request, res: Response) {
    const bloggerID = Number(req.params.id);
    const blogger = bloggers.find((b: BloggerType) => b.id === bloggerID);
    res.json(blogger);
  },

  createBlogger(req: Request, res: Response) {
    if (!isValidYoutubeURI(req.body.youtubeURI, re)) {
      error.data = {
        name: req.body.name,
        youtubeURI: req.body.youtubeURI,
      };
      error.errorMessage = {
        message: "invalid youtube URI",
        field: "youtubeURI",
      };
      error.resultCode = 1;
      res.status(400).json(error);
      return;
    } else if (!req.body.name.trim()) {
      error.data = {
        name: req.body.name,
        youtubeURI: req.body.youtubeURI,
      };
      error.errorMessage = {
        message: "Blogger's name is missing, please add",
        field: "name",
      };
      error.resultCode = 2;
      res.status(400).json(error);
      return;
    } else {
      // add ID already exists check!!!!!!!!!!!!!!!!!!!!
      const newBlogger: BloggerType = {
        id: Number(bloggers.length + 1),
        name: req.body.name,
        youtubeURI: req.body.youtubeURI,
      };
      bloggers.push(newBlogger);
      res.status(201).json(newBlogger);
    }
  },
  updateBlogger(req: Request, res: Response) {
    const bloggerID = Number(req.params.id);
    const blogger = bloggers.find((b: BloggerType) => b.id === bloggerID);
    const bloggerIndex = bloggers.findIndex((b: BloggerType) => b.id === bloggerID);

    if (isNaN(bloggerID) || !blogger) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID  or blogger doesn't exists",
      });
    } else if (!isValidYoutubeURI(req.body.youtubeURI, re)) {
      console.log("inside iURI check");
      error.data = {
        id: bloggerID,
        name: req.body.name,
        youtubeURI: req.body.youtubeURI,
      };
      error.errorMessage = {
        message: "invalid youtube URI",
        field: "youtubeURI",
      };
      error.resultCode = 1;
      res.status(400).json(error);
      return;
    } else if (!req.body.name.trim()) {
      console.log("inside name check");
      error.data = {
        id: bloggerID,
        name: req.body.name,
        youtubeURI: req.body.youtubeURI,
      };

      error.errorMessage = {
        message: "Blogger's name is missing, please add",
        field: "name",
      };
      error.resultCode = 2;
      res.status(400).json(error);
      return;
    }
    const updatedBlogger: BloggerType = {
      id: bloggerID,
      name: req.body.name,
      youtubeURI: req.body.youtubeURI,
    };

    bloggers.splice(bloggerIndex, 1, updatedBlogger);
    res.sendStatus(204);
  },
  deleteBlogger(req: Request, res: Response) {
    const bloggerID = Number(req.params.id);
    const blogger = bloggers.find((b: BloggerType) => b.id === bloggerID);
    const bloggerIndex = bloggers.findIndex((b: BloggerType) => b.id === bloggerID);
    if (isNaN(bloggerID) || !blogger) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID  or blogger doesn't exists",
      });
    }
    bloggers.splice(bloggerIndex, 1);
    res.sendStatus(204);
  },
};
