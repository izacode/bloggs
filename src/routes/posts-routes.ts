import { Router } from "express";
import { postsRepository } from "../repositories/posts-repository";

export const postsRouter = Router();

postsRouter.get("/", postsRepository.getAllPosts)
postsRouter.post("/", postsRepository.createPost);
postsRouter.get("/:id", postsRepository.getPost);
postsRouter.put("/:id", postsRepository.updatePost);
postsRouter.delete("/:id", postsRepository.deletePost);
