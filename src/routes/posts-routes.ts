import { Request, Response, Router } from "express";
import { bloggers } from "./bloggers-routes";



type PostType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerID: number;
  bloggerName?: string;
};

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

export const posts: PostType[] = [
  {
    id: 1,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 1,
  },
  {
    id: 2,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 2,
  },
  {
    id: 3,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 3,
  },
  {
    id: 4,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 4,
  },
  {
    id: 5,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 5,
  },
  {
    id: 6,
    title: "Post-02",
    shortDescription: "Second post of Blogger-01",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 1,
  },
  {
    id: 7,
    title: "Post-02",
    shortDescription: "Second post of Blogger-02",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 2,
  },
  {
    id: 8,
    title: "Post-02",
    shortDescription: "Second post of Blogger-03",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 3,
  },
  {
    id: 9,
    title: "Post-02",
    shortDescription: "Second post of Blogger-04",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 4,
  },
  {
    id: 10,
    title: "Post-02",
    shortDescription: "Second post of Blogger-05",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerID: 5,
  },
];



export const postsRouter = Router();


postsRouter.get("/", (req: Request, res: Response) => {
  const postsWithBloggerNames: PostType[] = posts.map((p) =>
    Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name })
  );
  res.status(200).json(postsWithBloggerNames);
});

postsRouter.post("/", (req: Request, res: Response) => {
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
});

postsRouter.get("/:id", (req: Request, res: Response) => {
  const postID: number = Number(req.params.id);

  const post = posts
    .map((p) => Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name }))
    .find((p) => +p.id === postID);
  res.status(200).json(post);
});

postsRouter.put("/:id", (req: Request, res: Response) => {
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
});

postsRouter.delete("/:id", (req: Request, res: Response) => {
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
});





