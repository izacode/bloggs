import { Router } from "express";
import { postsRepository } from "../repositories/bloggers-repository";

export const bloggersRouter = Router();

bloggersRouter.get("/", postsRepository.getAllBloggers);
bloggersRouter.get("/:id", postsRepository.getBlogger);
bloggersRouter.post("/", postsRepository.createBlogger);
bloggersRouter.put("/:id", postsRepository.updateBlogger);
bloggersRouter.delete("/:id", postsRepository.deleteBlogger);
