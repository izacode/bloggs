import { Request, Response } from "express";
import { CommentsService } from "../domain/comments-service";
import { PostsService } from "../domain/posts-service";
import { QueryType } from "../types/types";

export class PostsController {

  constructor(protected postsService: PostsService, protected commentsService: CommentsService) {}

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
