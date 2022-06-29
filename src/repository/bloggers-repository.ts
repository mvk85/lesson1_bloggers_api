import { inject, injectable } from "inversify";
import { removeObjectIdOption } from "../const";
import { Blogger, FilterBloggers } from "../types";
import { BloggersModel } from "./models.mongoose";

@injectable()
export class BloggersRepository {
    constructor(
        @inject(BloggersModel) private bloggersModel: typeof BloggersModel
    ){}

    async getBloggers(
        filter: FilterBloggers, 
        skip: number,
        limit: number,
    ): Promise<Blogger[]> {
        const bloggers = await this.bloggersModel
            .find(filter, removeObjectIdOption)
            .skip(skip)
            .limit(limit)
            .lean();

        return bloggers;
    }

    async getCountBloggers(
        filter: FilterBloggers, 
    ): Promise<number> {
        const count = await this.bloggersModel.count(filter)

        return count;
    }

    async getBloggerById(id: string): Promise<Blogger | null> {
        const query = this.bloggersModel.findOne({ id }, removeObjectIdOption);

        const blogger = await query

        return blogger;
    }

    async createBlogger(newBlogger: Blogger): Promise<Blogger | null> {
        await this.bloggersModel.create(newBlogger)

        const blogger = await this.bloggersModel.findOne({ id: newBlogger.id }, removeObjectIdOption)

        return blogger;
    }

    async deleteBloggerById(id: string) {
        const result = await this.bloggersModel.deleteOne({ id })

        return result.deletedCount === 1;
    }

    async updateBloggerById(id: string, {name, youtubeUrl}: { name: string, youtubeUrl: string }) {
        const result = await this.bloggersModel.updateOne(
            { id }, 
            { $set: { name, youtubeUrl }}
        )

        return result.matchedCount === 1;
    }

    async deleteAllBloggers() {
        await this.bloggersModel.deleteMany({})
    }
}