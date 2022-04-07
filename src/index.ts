import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {bloggersRouter} from "./routes/bloggers-routes"
import {postsRouter} from "./routes/posts-routes"

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use("/bloggers", bloggersRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


