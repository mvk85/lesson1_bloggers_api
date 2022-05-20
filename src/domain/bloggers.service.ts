import { ObjectId, WithId } from "mongodb";
import { bloggersRepository } from "../repository/bloggers-repository";
import { Blogger } from "../types";

export const bloggersService = {
    async getBloggers(filter: {} = {}): Promise<Blogger[]> {
        const bloggers = await bloggersRepository.getBloggers(filter);

        return bloggers;
    },

    async getBloggerById(id: number): Promise<Blogger | null> {
        const blogger = await bloggersRepository.getBloggerById(id)

        return blogger
    },

    async createBlogger(name: string, youtubeUrl: string) {
        const newBloggers: Blogger = {
            _id: new ObjectId(),
            id: +(new Date()),
            name,
            youtubeUrl
        }

        await bloggersRepository.createBlogger(newBloggers)

        return newBloggers;
    },

    async deleteBloggerById(id: number) {
        const isDeleted = await bloggersRepository.deleteBloggerById(id);

        return isDeleted;
    },

    async updateBloggerById(id: number, data: { name: string, youtubeUrl: string }) {
        const isUpdated = await bloggersRepository.updateBloggerById(id, data);

        return isUpdated;
    }
}