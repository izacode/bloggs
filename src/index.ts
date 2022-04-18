import express,{Request,Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {bloggersRouter} from "./routes/bloggers-routes"
import {postsRouter} from "./routes/posts-routes"
import { runDb } from "./repositories/dbmongo";

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
app.get("/", (req:Request,res:Response)=>{
  res.json({id:1})
})

app.use("/bloggers", bloggersRouter);
app.use("/posts", postsRouter);


const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startApp();






