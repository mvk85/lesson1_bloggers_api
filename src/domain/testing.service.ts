import { injectable } from "inversify";
import { BloggersRepository } from "../repository/bloggers-repository"
import { CommentsRepository } from "../repository/comments-repository";
import { PostsRepository } from "../repository/posts-repository";
import { RequestsRepository } from "../repository/requests-repository";
import { UsersRepository } from "../repository/users-repository";

@injectable()
export class TestingService {
    constructor(
        protected bloggersRepository: BloggersRepository,
        protected commentsRepository: CommentsRepository,
        protected postsRepository: PostsRepository,
        protected requestsRepository: RequestsRepository,
        protected usersRepository: UsersRepository
    ) {}

    async deleteAllData() {
        await this.bloggersRepository.deleteAllBloggers();
        await this.commentsRepository.deleteAllComments();
        await this.postsRepository.deleteAllPosts();
        await this.usersRepository.deleteAllUsers();
        await this.requestsRepository.deleteAll();
    }
}

