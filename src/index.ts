import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

const re = /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w-]+)*\/?$/;

const isValidYoutubeURI = (field: string, regex: any) => {
  return regex.test(field);
};

const bloggers = [
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

const posts = [
  {
    id: 1,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 1,
    bloggerName: "Blogger-01",
  },
  {
    id: 2,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 2,
    bloggerName: "Blogger-02",
  },
  {
    id: 3,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 3,
    bloggerName: "Blogger-03",
  },
  {
    id: 4,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 4,
    bloggerName: "Blogger-04",
  },
  {
    id: 5,
    title: "Post-01",
    shortDescription: "First post of Blogger-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 5,
    bloggerName: "Blogger-05",
  },
  {
    id: 6,
    title: "Post-02",
    shortDescription: "Second post of Blogger-01",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 1,
    bloggerName: "Blogger-01",
  },
  {
    id: 7,
    title: "Post-02",
    shortDescription: "Second post of Blogger-02",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 2,
    bloggerName: "Blogger-02",
  },
  {
    id: 8,
    title: "Post-02",
    shortDescription: "Second post of Blogger-03",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 3,
    bloggerName: "Blogger-03",
  },
  {
    id: 9,
    title: "Post-02",
    shortDescription: "Second post of Blogger-04",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 4,
    bloggerName: "Blogger-04",
  },
  {
    id: 10,
    title: "Post-02",
    shortDescription: "Second post of Blogger-05",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: 5,
    bloggerName: "Blogger-05",
  },
];

// Bloggers

app.get("/", (req: Request, res: Response) => {
  res.send("Hello there!!!!!!!!!!!!!!!!!");
});
app.get("/bloggers", (req: Request, res: Response) => {
  res.status(200).json(bloggers);
});
app.get("/bloggers/:id", (req: Request, res: Response) => {
  const bloggerID = Number(req.params.id);
  const blogger = bloggers.find((b) => b.id === bloggerID);
  res.status(200).json(blogger);
});
app.post("/bloggers", (req: Request, res: Response) => {
  if (isValidYoutubeURI(req.body.youtubeURI, re)) {
    const newBlogger = {
      id: Number(bloggers.length + 1),
      name: req.body.name,
      youtubeURI: req.body.youtubeURI,
    };
    if (!newBlogger.name) {
      return res.status(400).json({
        status: "fail",
        message: "Name is missing",
      });
    }
    bloggers.push(newBlogger);
    res.status(201).json(newBlogger);
  } else {
    res.status(400).json({
      status: "fail",
      message: "invalid youtube URI",
    });
  }
});
app.put("/bloggers/:id", (req: Request, res: Response) => {
  const bloggerID = Number(req.params.id);

  if (isNaN(bloggerID) || bloggers.length < bloggerID) {
    return res.status(404).json({
      status: "fail",
      message: "404 not found , Invalid ID",
    });
  } else if (req.body.name === "") {
    return res.status(400).json({
      status: "fail",
      message: "Blogger's name is missing, pls add",
    });
  } else if (isValidYoutubeURI(req.body.youtubeURI, re)) {
    const updatedBlogger = {
      id: bloggerID,
      name: req.body.name,
      youtubeURI: req.body.youtubeURI,
    };

    bloggers.splice(bloggerID - 1, 1, updatedBlogger);
    res.status(204).send("Updated");
  } else {
    res.status(400).json({
      status: "fail",
      message: "invalid youtube URI",
    });
  }
});
app.delete("/bloggers/:id", (req: Request, res: Response) => {
  const bloggerID = Number(req.params.id);
  if (isNaN(bloggerID) || bloggers.length < bloggerID) {
    return res.status(404).json({
      status: "fail",
      message: "404 not found , Invalid ID",
    });
  }
  bloggers.splice(bloggerID - 1, 1);
  res.status(204).send("Deleted");
});

// Posts==========================================

app.get("/posts", (req: Request, res: Response) => {
  res.status(200).json(posts);
});

app.post("/posts", (req: Request, res: Response) => {
  if (
    req.body.title === "" ||
    req.body.shortDescription === "" ||
    req.body.content === "" ||
    req.body.bloggerID === "" ||
    req.body.bloggerName === ""
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Wrong inputs, please check all fields",
    });
  }

  const newPost = {
    id: Number(posts.length + 1),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, deserunt!",
    bloggerId: req.body.bloggerID,
    bloggerName: req.body.bloggerName,
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

app.get("/posts/:id", (req: Request, res: Response) => {
  const postID = Number(req.params.id);
  const post = posts.find((p) => p.id === postID);
  res.status(200).json(post);
});

app.put("/posts/:id", (req: Request, res: Response) => {
  const postID = Number(req.params.id);
  const post = posts.find((p) => p.id === postID);

  if (postID > posts.length || isNaN(postID)) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else if (
    req.body.title === "" ||
    req.body.shortDescription === "" ||
    req.body.content === "" ||
    isNaN(req.body.bloggerID) ||
    req.body.bloggerName === ""
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid input. Please fill up all fields",
    });
  } else if (post !== undefined) {
    const updatedPost = {
      id: postID,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerId: req.body.bloggerId,
      bloggerName: post.bloggerName,
    };

    posts.splice(postID - 1, 1, updatedPost);
    res.status(204);
  }
});

app.delete("/posts/:id", (req: Request, res: Response) => {
  const postID = Number(req.params.id);
  if (isNaN(postID) || posts.length < postID) {
    return res.status(404).json({
      status: "fail",
      message: "404 not found , Invalid ID",
    });
  }
  posts.splice(postID - 1, 1);
  res.status(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
