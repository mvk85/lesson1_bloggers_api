import { bloggersRepository } from "../repository/bloggers-repository"
import { commentsRepository } from "../repository/comments-repository";
import { postsRepository } from "../repository/posts-repository";
import { requestsRepository } from "../repository/requests-repository";
import { usersRepository } from "../repository/users-repository";

class TestingService {
    async deleteAllData() {
        await bloggersRepository.deleteAllBloggers();
        await commentsRepository.deleteAllComments();
        await postsRepository.deleteAllPosts();
        await usersRepository.deleteAllUsers();
        await requestsRepository.deleteAll();
    }
}

export const testingService = new TestingService();
