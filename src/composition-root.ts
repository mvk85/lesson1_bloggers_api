import 'reflect-metadata'
import { Container } from "inversify";
import { BloggersService } from "./domain/bloggers.service";
import { BloggersRepository } from "./repository/bloggers-repository";
import { BloggersController } from "./routers/BloggersController";
import { CommentsService } from './domain/comments.service';
import { CommentsRepository } from './repository/comments-repository';
import { CommentsController } from "./routers/CommentsController";
import { PostsController } from "./routers/PostsController";
import { PostsService } from './domain/posts.service';
import { PostsRepository } from './repository/posts-repository';
import { TestingController } from "./routers/TestingController";
import { TestingService } from './domain/testing.service';
import { UsersController } from "./routers/UsersController";
import { UsersService } from './domain/users.service';
import { UsersRepository } from './repository/users-repository';
import { RequestsService } from './domain/requests.service';
import { RequestsRepository } from './repository/requests-repository';
import { AuthController } from "./routers/AuthController";
import { AuthService } from './domain/auth.service';
import { EmailAtapter } from './adapters/email-adapter';
import { EmailManager } from './magangers/email-manager';
import { AuthChecker } from './middleware/auth.middleware';
import { BloggerValidator } from './middleware/blogger-id-validation';
import { ExistenceChecker } from './middleware/check-exist.middleware';
import { InputValidators } from './middleware/input-validation.middleware';
import { IpChecker } from './middleware/request-middleware';
import { BloggersModel, CommentsModel, PostsModel, BadRefreshTokensModel, RequestsModel, UsersModel } from './repository/models.mongoose';
import { JwtUtility } from './heplers/JwtUtility';
import { AuthRepository } from './repository/auth-repository';
import { RefreshTokenValidator } from './middleware/check-refresh-token.middleware';
import { IoCConstantsKey } from './types';

export const container = new Container()

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)
container.bind(AuthRepository).to(AuthRepository)

container.bind(BloggersController).to(BloggersController)
container.bind(BloggersService).to(BloggersService)
container.bind(BloggersRepository).to(BloggersRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)

container.bind(TestingController).to(TestingController)
container.bind(TestingService).to(TestingService)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)

container.bind(RequestsService).to(RequestsService)
container.bind(RequestsRepository).to(RequestsRepository)

container.bind(EmailAtapter).to(EmailAtapter)

container.bind(EmailManager).to(EmailManager)

container.bind(AuthChecker).to(AuthChecker)

container.bind(BloggerValidator).to(BloggerValidator)

container.bind(ExistenceChecker).to(ExistenceChecker)

container.bind(InputValidators).to(InputValidators)

container.bind(IpChecker).to(IpChecker)

container.bind(JwtUtility).to(JwtUtility)

container.bind(RefreshTokenValidator).to(RefreshTokenValidator)

// models
container.bind(BloggersModel).toConstantValue(BloggersModel)
container.bind(UsersModel).toConstantValue(UsersModel)
container.bind(PostsModel).toConstantValue(PostsModel)
container.bind(CommentsModel).toConstantValue(CommentsModel)
container.bind(RequestsModel).toConstantValue(RequestsModel)
container.bind(BadRefreshTokensModel).toConstantValue(BadRefreshTokensModel)

// constants

const isProduction = process.env.NODE_ENV === 'Production';

container.bind(IoCConstantsKey.isProduction).toConstantValue(isProduction)
