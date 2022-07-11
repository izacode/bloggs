import { Router, Request, Response } from "express";
import { BloggersService } from "../domain/bloggers-service";
import { PostsService } from "../domain/posts-service";
import { QueryType } from "../types/types";
import {
  inputValidationMiddleware,
  nameValidation,
  youtubeURIValidation,
  bloggerIDValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIdQueryValidation,
} from "../middleware/inputValidation";
import { authorization } from "../middleware/authMiddleware";

export const bloggersRouter = Router();

//  Controller =================================================================================================================

class BloggersController {

bloggersService: BloggersService
postsService: PostsService


constructor(){
  this.bloggersService =new BloggersService()
  this.postsService= new PostsService()

}

  async getBloggers(req: Request, res: Response) {
    const { SearchNameTerm = null, PageNumber = 1, PageSize = 10 } = req.query as QueryType;
    const bloggers = await this.bloggersService.getAllBloggers(SearchNameTerm, PageNumber, PageSize);
    res.json(bloggers);
  }

  async createBlogger(req: Request, res: Response) {
    const { name, youtubeUrl } = req.body;
    const newBlogger = await this.bloggersService.createBlogger(name, youtubeUrl);
    res.status(201).json(newBlogger);
  }

  async getBlogger(req: Request, res: Response) {
    const blogger = await this.bloggersService.getBlogger(req.params.id);
    blogger ? res.json(blogger) : res.sendStatus(404);
  }

  async updateBlogger(req: Request, res: Response) {
    const isdUpdated: boolean = await this.bloggersService.updateBlogger(req.params.id, req.body.name, req.body.youtubeUrl);
    isdUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }

  async deleteBlogger(req: Request, res: Response) {
    const isDeleted: boolean = await this.bloggersService.deleteBlogger(req.params.id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }

  async getBloggerPosts(req: Request, res: Response) {
    const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
    const bloggerPosts = await this.bloggersService.getAllBloggerPosts(req.params.bloggerId, PageNumber, PageSize);
    bloggerPosts ? res.json(bloggerPosts) : res.sendStatus(404);
  }
  
  async createBloggerPost(req: Request, res: Response) {
    const { body, params } = req;
    const newPost = await this.postsService.createPost(body, params);

    newPost ? res.status(201).json(newPost) : res.sendStatus(404);
  }
}

const bloggersController = new BloggersController();

//  Routes =====================================================================================================================

bloggersRouter.get("/", bloggersController.getBloggers);
bloggersRouter.post("/", authorization, nameValidation, youtubeURIValidation, inputValidationMiddleware, bloggersController.createBlogger);
bloggersRouter.get("/:id", bloggersController.getBlogger);
bloggersRouter.put("/:id", authorization, nameValidation, youtubeURIValidation, inputValidationMiddleware, bloggersController.updateBlogger);
bloggersRouter.delete("/:id", authorization, bloggersController.deleteBlogger);
bloggersRouter.get("/:bloggerId/posts", bloggersController.getBloggerPosts);
bloggersRouter.get("/:bloggerId/posts", bloggersController.createBloggerPost);

bloggersRouter.post(
  "/:bloggerId/posts",
  authorization,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidationMiddleware,
  bloggersController.createBloggerPost
);
