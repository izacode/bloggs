import { Request, Response, Router } from "express";
import { TestingService } from "../domain/testing-service";
export const testingRouter = Router();

class TestingController {
  testingService: TestingService
  constructor(){
    this.testingService = new TestingService()
  }
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

const testingController = new TestingController()

testingRouter.delete("/all-data", testingController.test.bind(testingController) );
