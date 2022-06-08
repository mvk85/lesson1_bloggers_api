import { bloggersRepository } from "../repository/bloggers-repository"
import { commentsRepository } from "../repository/comments-repository";
import { postsRepository } from "../repository/posts-repository";
import { usersRepository } from "../repository/users-repository";

export const testingService = {
    async deleteAllData() {
        await bloggersRepository.deleteAllBloggers();
        await commentsRepository.deleteAllComments();
        await postsRepository.deleteAllPosts();
        await usersRepository.deleteAllUsers();
    }
}