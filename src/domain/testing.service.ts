import { BloggersRepository } from "../repository/bloggers-repository"
import { CommentsRepository } from "../repository/comments-repository";
import { PostsRepository } from "../repository/posts-repository";
import { RequestsRepository } from "../repository/requests-repository";
import { UsersRepository } from "../repository/users-repository";

export class TestingService {
    bloggersRepository: BloggersRepository

    commentsRepository: CommentsRepository

    postsRepository: PostsRepository

    requestsRepository: RequestsRepository

    usersRepository: UsersRepository

    constructor() {
        this.bloggersRepository = new BloggersRepository();    
        this.commentsRepository = new CommentsRepository();
        this.postsRepository = new PostsRepository();
        this.requestsRepository = new RequestsRepository();
        this.usersRepository = new UsersRepository();
    }

    async deleteAllData() {
        await this.bloggersRepository.deleteAllBloggers();
        await this.commentsRepository.deleteAllComments();
        await this.postsRepository.deleteAllPosts();
        await this.usersRepository.deleteAllUsers();
        await this.requestsRepository.deleteAll();
    }
}

