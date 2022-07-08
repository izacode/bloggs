import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { bloggersRouter } from "./routes/bloggers-routes";
import { postsRouter } from "./routes/posts-routes";
import { runDb } from "./repositories/dbmongo";
import { usersRouter } from "./routes/users-routes";
import { authRouter } from "./routes/auth-router";
import { commentsRouter } from "./routes/comments-router";
import { testingRouter } from "./routes/testing-router";
import cookieParser from "cookie-parser";
import { logRequest } from "./middleware/authMiddleware";

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;
app.use(logRequest)
app.set("trust proxy", true);
app.use("/bloggers", bloggersRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/comments", commentsRouter);
app.use("/testing", testingRouter);

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startApp();
