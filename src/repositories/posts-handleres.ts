import { Request, Response } from "express";
import { posts, PostType, bloggers } from "./DB";



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

export const postsHandlers = {
  getAllPosts(req: Request, res: Response) {
    const postsWithBloggerNames: PostType[] = posts.map((p) =>
      Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name })
    );
    res.status(200).json(postsWithBloggerNames);
  },
  getPost(req: Request, res: Response) {
    const postID: number = Number(req.params.id);

    const post = posts
      .map((p) => Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name }))
      .find((p) => +p.id === postID);
    res.status(200).json(post);
  },

  createPost(req: Request, res: Response) {
    if (
      req.body.title === "" ||
      req.body.shortDescription === "" ||
      req.body.content === "" ||
      req.body.bloggerID === "" ||
      isNaN(req.body.bloggerID)
    ) {
      error.data.title = req.body.title;
      error.data.shortDescription = req.body.shortDescription;
      error.data.content = req.body.content;
      error.data.bloggerID = req.body.bloggerID;
      error.resultCode = 3;

      if (req.body.title === "") {
        error.errorMessage = {
          message: "Title is missing, please add",
          field: "title",
        };
      } else if (req.body.shortDescription === "") {
        error.errorMessage = {
          message: "ShortDescription is missing, please add",
          field: "shortDescription",
        };
      } else if (req.body.content === "") {
        error.errorMessage = {
          message: "Content is missing, please add",
          field: "content",
        };
      } else if (req.body.bloggerID === "") {
        error.errorMessage = {
          message: "BloggerID is missing",
          field: "bloggerID",
        };
        return res.status(404).send(error);
      } else if (isNaN(req.body.bloggerID)) {
        error.errorMessage = {
          message: "BloggerID is invalid",
          field: "bloggerID",
        };
      }
      return res.status(400).send(error);
    } else {
      const newPost = {
        id: Number(posts.length + 1),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
        bloggerID: req.body.bloggerID,
        bloggerName: req.body.bloggerName,
      };

      posts.push(newPost);
      res.status(201).json(newPost);
    }
  },
  updatePost(req: Request, res: Response) {
    const postID = Number(req.params.id);
    const postWithBloggerName = posts
      .map((p) => Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name }))
      .find((p) => p.id === postID);

    if (postID > posts.length || isNaN(postID)) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID",
      });
    } else if (
      req.body.title === "" ||
      req.body.shortDescription === "" ||
      req.body.content === "" ||
      req.body.bloggerID === "" ||
      isNaN(req.body.bloggerID)
    ) {
      error.data.title = req.body.title;
      error.data.shortDescription = req.body.shortDescription;
      error.data.content = req.body.content;
      error.data.bloggerID = req.body.bloggerID;
      error.resultCode = 3;
      if (req.body.title === "") {
        error.errorMessage = {
          message: "Title is missing, please add",
          field: "title",
        };
      } else if (req.body.shortDescription === "") {
        error.errorMessage = {
          message: "ShortDescription is missing, please add",
          field: "shortDescription",
        };
      } else if (req.body.content === "") {
        error.errorMessage = {
          message: "Content is missing, please add",
          field: "content",
        };
      } else if (req.body.bloggerID === "") {
        error.errorMessage = {
          message: "BloggerID is missing, please add",
          field: "bloggerID",
        };
      } else if (isNaN(req.body.bloggerID)) {
        error.errorMessage = {
          message: "BloggerID is invalid",
          field: "bloggerID",
        };
      }

      return res.status(400).send(error);
    } else if (postWithBloggerName !== undefined) {
      const updatedPost: PostType = {
        id: postID,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerID: req.body.bloggerID,
        bloggerName: postWithBloggerName?.bloggerName,
      };

      const postIndex = posts.findIndex((b) => b.id === postID);
      posts.splice(postIndex, 1, updatedPost);

      res.status(200).json({
        status: "success",
        data: {
          updatedPost,
        },
      });
    }
  },
  deletePost(req: Request, res: Response) {
    const postID = Number(req.params.id);
    const post = posts.find((b) => b.id === postID);
    const postIndex = posts.findIndex((b) => b.id === postID);
    if (isNaN(postID) || !post) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID  or post doesn't exists",
      });
    }
    posts.splice(postIndex, 1);
    res.send(posts);
  },
};
