import { Router } from "express";
import { bloggersHandlers } from "../repositories/bloggers-handlers";

export const bloggersRouter = Router();

bloggersRouter.get("/", bloggersHandlers.getAllBloggers);
bloggersRouter.get("/:id", bloggersHandlers.getBlogger);
bloggersRouter.post("/", bloggersHandlers.createBlogger);
bloggersRouter.put("/:id", bloggersHandlers.updateBlogger);
bloggersRouter.delete("/:id", bloggersHandlers.deleteBlogger);
