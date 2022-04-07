import { Router } from "express";
import { postsHandlers } from "../repositories/posts-handleres";

export const postsRouter = Router();

postsRouter.get("/", postsHandlers.getAllPosts)
postsRouter.post("/", postsHandlers.createPost);
postsRouter.get("/:id", postsHandlers.getPost);
postsRouter.put("/:id", postsHandlers.updatePost);
postsRouter.delete("/:id", postsHandlers.deletePost);
