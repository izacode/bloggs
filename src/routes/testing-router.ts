import { Request, Response, Router } from "express";
import { testingService } from "../domain/testing-service";
export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  const isDeletedUsers = await testingService.deleteAllUsers();
  if (!isDeletedUsers) return res.sendStatus(400);
  const isDeletedBloggers = await testingService.deleteAllBloggers();
  if (!isDeletedBloggers) return res.sendStatus(400);
  const isDeletedPosts = await testingService.deleteAllPosts();
  if (!isDeletedPosts) return res.sendStatus(400);
  const isDeletedComments = await testingService.deleteAllComments();
  if (!isDeletedComments) return res.sendStatus(400);
  const isDeletedUsersAccount = await testingService.deleteAllUsersAccount();
  if (!isDeletedUsersAccount) return res.sendStatus(400);
  const isDeletedIps = await testingService.deleteAllIps();
  if (!isDeletedIps) return res.sendStatus(400);
  const isDeletedRequests = await testingService.deleteAllRequests();
  if (!isDeletedRequests) return res.sendStatus(400);

  res.sendStatus(204);
});
