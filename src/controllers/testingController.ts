import { Request, Response } from "express";
import { TestingService } from "../domain/testing-service";

export class TestingController {
  constructor(protected testingService: TestingService) {}
  async test(req: Request, res: Response) {
    const isDeletedUsers = await this.testingService.deleteAllUsers();
    if (!isDeletedUsers) return res.sendStatus(400);
    const isDeletedBloggers = await this.testingService.deleteAllBloggers();
    if (!isDeletedBloggers) return res.sendStatus(400);
    const isDeletedPosts = await this.testingService.deleteAllPosts();
    if (!isDeletedPosts) return res.sendStatus(400);
    const isDeletedComments = await this.testingService.deleteAllComments();
    if (!isDeletedComments) return res.sendStatus(400);
    const isDeletedUsersAccount = await this.testingService.deleteAllUsersAccount();
    if (!isDeletedUsersAccount) return res.sendStatus(400);
    const isDeletedIps = await this.testingService.deleteAllIps();
    if (!isDeletedIps) return res.sendStatus(400);
    // const isDeletedRequests = await testingService.deleteAllRequests();
    // if (!isDeletedRequests) return res.sendStatus(400);

    res.sendStatus(204);
  }
}
