import { Router, Request, Response } from "express";
import { CommentsService } from "../domain/comments-service";

import { PostsService} from "../domain/posts-service";
import { authentication, authorization } from "../middleware/authMiddleware";

import {
  inputValidationMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  queryValidation,
  postIDValidation,
  bloggerIDBodyValidation,
  commentContentValidation,
} from "../middleware/inputValidation";

import { QueryType } from "../types/types";

export const postsRouter = Router();

class PostsController {
  postsService: PostsService;
  commentsService: CommentsService

  constructor() {
    this.postsService = new PostsService()
    this.commentsService = new CommentsService()
  }

  async getPosts(req: Request, res: Response) {
    const { SearchTitleTerm = null, PageNumber = 1, PageSize = 10 } = req.query as QueryType;

    const posts = await this.postsService.getAllPosts(SearchTitleTerm, PageNumber, PageSize);
    res.json(posts);
  }

  async createPost(req: Request, res: Response) {
    const { body, params } = req;
    const createdPost = await this.postsService.createPost(body, params);
    createdPost ? res.status(201).json(createdPost) : res.sendStatus(404);
  }

  async getPost(req: Request, res: Response) {
    const post = await this.postsService.getPost(req.params.id);
    post ? res.json(post) : res.sendStatus(404);
  }

  async updatePost(req: Request, res: Response) {
    const isUpdated: boolean = await this.postsService.updatePost(
      req.params.id,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.bloggerId
    );

    isUpdated ? res.sendStatus(204) : res.sendStatus(404);
  }

  async deletePost(req: Request, res: Response) {
    const isDeleted = await this.postsService.deletePost(req.params.id);
    isDeleted ? res.sendStatus(204) : res.sendStatus(404);
  }

  async getPostComments(req: Request, res: Response) {
    const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
    const post = await this.postsService.getPost(req.params.id);
    if (!post) return res.sendStatus(404);
    const postComments = await this.commentsService.getAllPostComments(post.id!, PageNumber, PageSize);
    res.send(postComments);
  }

  async createPostComment(req: Request, res: Response) {
    const post = await this.postsService.getPost(req.params.id);
    if (!post) return res.sendStatus(404);
    const newComment = await this.commentsService.createComment(
      req.params.id,
      req.body.content,
      req.context.user!._id,
      req.context.user!.accountData.userName
    );
    res.status(201).send(newComment);
  }
}

const postsController = new PostsController();

// Routes ===========================================================================

postsRouter.get("/", queryValidation, inputValidationMiddleware, postsController.getPosts.bind(postsController));

postsRouter.post(
  "/",
  authorization,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDBodyValidation,
  inputValidationMiddleware,
  postsController.createPost.bind(postsController)
);

postsRouter.get("/:id", postIDValidation, inputValidationMiddleware, postsController.getPost.bind(postsController));

postsRouter.put(
  "/:id",
  authorization,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  bloggerIDBodyValidation,
  inputValidationMiddleware,
  postsController.updatePost.bind(postsController)
);

postsRouter.delete("/:id", authorization, postIDValidation, inputValidationMiddleware, postsController.deletePost.bind(postsController));

// =============    Comments   =======================

postsRouter.get("/:id/comments", postsController.getPostComments.bind(postsController));

postsRouter.post("/:id/comments", authentication, commentContentValidation, inputValidationMiddleware, postsController.createPostComment.bind(postsController));
