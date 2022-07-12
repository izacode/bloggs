import { JwtService } from "./application/jwt-service";
import { AuthController } from "./controllers/authController";
import { BloggersController } from "./controllers/bloggersController";
import { CommentsController } from "./controllers/commentsController";
import { PostsController } from "./controllers/postsController";
import { UsersController } from "./controllers/usersController";
import { TestingController } from "./controllers/testingController";
import { AuthService } from "./domain/auth-service";
import { BloggersService } from "./domain/bloggers-service";
import { CommentsService } from "./domain/comments-service";
import { EmailService } from "./domain/email-service";
import { PostsService } from "./domain/posts-service";
import { TestingService } from "./domain/testing-service";
import { UsersService } from "./domain/users-service";
import { EmailManager } from "./managers/email-manager";
import { BloggersRepository } from "./repositories/bloggers-db-repository";
import { CommentsRepository } from "./repositories/comments-db-repository";
import { PostsRepository } from "./repositories/posts-db-repository";
import { UsersRepository } from "./repositories/users-db-repository";

const emailManager = new EmailManager()

// Repos===================================================================================
const bloggersRepository = new BloggersRepository()
const postsRepository = new PostsRepository()
const usersRepository = new UsersRepository()
const commentsRepository = new CommentsRepository()
// Services ===============================================================================
export const jwtService = new JwtService(usersRepository)
const bloggersService = new BloggersService(bloggersRepository)
export const commentsService = new CommentsService(commentsRepository)
const postsService = new PostsService(postsRepository,bloggersRepository)
export const usersService = new UsersService(usersRepository);
const emailService = new EmailService(emailManager);
const authService = new AuthService(usersRepository, emailService);
const testingService = new TestingService(postsRepository,bloggersRepository,commentsRepository, usersRepository)
// Controllers ============================================================================
export const usersController = new UsersController(usersService, authService);
export const authController = new AuthController(authService,jwtService,emailService)
export const bloggersController = new BloggersController(bloggersService,postsService)
export const postsController = new PostsController(postsService, commentsService);
export const commentsController = new CommentsController(commentsService)
export const testingController = new TestingController(testingService)