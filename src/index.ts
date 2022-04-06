import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { videosRouter } from "./routes/videos-routes";

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/videos", videosRouter);
const port = process.env.PORT || 5000;

const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;

const isValidYoutubeURI = (field: string, regex: any) => {
  return regex.test(field);
};

type BloggerType = {
  id: number;
  name: string;
  youtubeURI: string;
};

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

const bloggers: BloggerType[] = [
  {
    id: 1,
    name: "Blogger-01",
    youtubeURI: "https://www.youtube.com/Blogger-01",
  },
  {
    id: 2,
    name: "Blogger-02",
    youtubeURI: "https://www.youtube.com/Blogger-02",
  },
  {
    id: 3,
    name: "Blogger-03",
    youtubeURI: "https://www.youtube.com/Blogger-03",
  },
  {
    id: 4,
    name: "Blogger-04",
    youtubeURI: "https://www.youtube.com/Blogger-04",
  },
  {
    id: 5,
    name: "Blogger-05",
    youtubeURI: "https://www.youtube.com/Blogger-05",
  },
];

const posts: PostType[] = [
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

// const checkBloggerID = (id:number, bloggers: BloggerType[], res: Response, next: NextFunction) => {
//     const bloggerID = id;
//     const blogger = bloggers.find((b) => b.id === bloggerID);
//     if(!bloggerID || !blogger){
//       return res.status(404).json({
//         status: "fail",
//         message: "Invalid ID  or blogger doesn't exists",
//       });
//     }
//     next()
// }

// Bloggers

app.get("/", (req: Request, res: Response) => {
  res.send("Hello there!!!!!!!!!!!!!!!!!");
});
app.get("/bloggers", (req: Request, res: Response) => {
  res.json(bloggers);
});
app.get("/bloggers/:id", (req: Request, res: Response) => {
  const bloggerID = Number(req.params.id);
  const blogger = bloggers.find((b) => b.id === bloggerID);
  res.json(blogger);
});

app.post("/bloggers", (req: Request, res: Response) => {
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
});

app.put("/bloggers/:id", (req: Request, res: Response) => {
  const bloggerID = Number(req.params.id);
  const blogger = bloggers.find((b) => b.id === bloggerID);
  const bloggerIndex = bloggers.findIndex((b) => b.id === bloggerID);

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
});

app.delete("/bloggers/:id", (req: Request, res: Response) => {
  const bloggerID = Number(req.params.id);
  const blogger = bloggers.find((b) => b.id === bloggerID);
  const bloggerIndex = bloggers.findIndex((b) => b.id === bloggerID);
  if (isNaN(bloggerID) || !blogger) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID  or blogger doesn't exists",
    });
  }
  bloggers.splice(bloggerIndex, 1);
  res.sendStatus(204);
});

// Posts==========================================

app.get("/posts", (req: Request, res: Response) => {
  const postsWithBloggerNames: PostType[] = posts.map((p) =>
    Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name })
  );
  res.status(200).json(postsWithBloggerNames);
});

app.post("/posts", (req: Request, res: Response) => {
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

app.get("/posts/:id", (req: Request, res: Response) => {
  const postID: number = Number(req.params.id);

  const post = posts
    .map((p) => Object.assign(p, { bloggerName: bloggers.find((b) => b.id === p.bloggerID)?.name }))
    .find((p) => +p.id === postID);
  res.status(200).json(post);
});

app.put("/posts/:id", (req: Request, res: Response) => {
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

app.delete("/posts/:id", (req: Request, res: Response) => {
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
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
