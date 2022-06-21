import { BloggersRepository } from "../repositories/bloggers-db-repository";
import { CommentsRepository } from "../repositories/comments-db-repository";
import { PostsRepository } from "../repositories/posts-db-repository";
import { UsersRepository } from "../repositories/users-db-repository";


class TestingService {
 constructor(private postsRepository: PostsRepository, private bloggersRepository: BloggersRepository,private commentsRepository: CommentsRepository,private usersRepository: UsersRepository) {};
  async deleteAllUsers(): Promise<boolean> {
    const isDBCleared = await this.usersRepository.deleteAllUsers();
    return isDBCleared;
  }
  async deleteAllBloggers(): Promise<boolean> {
    const isDBCleared = await this.bloggersRepository.deleteAllBloggers();
    return isDBCleared;
  }
  async deleteAllPosts(): Promise<boolean> {
    const isDBCleared = await this.postsRepository.deleteAllPosts();
    return isDBCleared;
  }
  async deleteAllComments(): Promise<boolean> {
    const isDBCleared = await this.commentsRepository.deleteAllComments();
    return isDBCleared;
  }
  async deleteAllUsersAccount(): Promise<boolean> {
    const isDBCleared = await this.usersRepository.deleteAllUsersAccount();
    return isDBCleared;
  }
  async deleteAllIps(): Promise<boolean> {
    const isDBCleared = await this.usersRepository.deleteAllIps();
    return isDBCleared;
  }
};

const postsRepository = new PostsRepository();
const commentsRepository = new CommentsRepository();
const usersRepository = new UsersRepository();
const bloggersRepository = new BloggersRepository(); // Should I create it here or import from bloggesService since it's already  there
export const testingService = new TestingService(postsRepository, bloggersRepository, commentsRepository, usersRepository);