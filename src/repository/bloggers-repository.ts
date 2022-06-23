import { removeObjectIdOption } from "../const";
import { Blogger, FilterBloggers } from "../types";
import { BloggersModel } from "./db"

export const bloggersRepository = {
    async getBloggers(
        filter: FilterBloggers, 
        skip: number,
        limit: number,
    ): Promise<Blogger[]> {
        const bloggers = await BloggersModel
            .find(filter, removeObjectIdOption)
            .skip(skip)
            .limit(limit)
            .lean();

        return bloggers;
    },

    async getCountBloggers(
        filter: FilterBloggers, 
    ): Promise<number> {
        const count = await BloggersModel.count(filter)

        return count;
    },

    async getBloggerById(id: string): Promise<Blogger | null> {
        const blogger = await BloggersModel.findOne({ id }, removeObjectIdOption)

        return blogger;
    },

    async createBlogger(newBlogger: Blogger): Promise<Blogger | null> {
        await BloggersModel.create(newBlogger)

        const blogger = await BloggersModel.findOne({ id: newBlogger.id }, removeObjectIdOption)

        return blogger;
    },

    async deleteBloggerById(id: string) {
        const result = await BloggersModel.deleteOne({ id })

        return result.deletedCount === 1;
    },

    async updateBloggerById(id: string, {name, youtubeUrl}: { name: string, youtubeUrl: string }) {
        const result = await BloggersModel.updateOne(
            { id }, 
            { $set: { name, youtubeUrl }}
        )

        return result.matchedCount === 1;
    },

    async deleteAllBloggers() {
        await BloggersModel.deleteMany({})
    }
}