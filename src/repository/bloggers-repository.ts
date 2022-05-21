import { Blogger, FilterBloggers } from "../types";
import { deleteObjectId, deleteObjectsId } from "../utils";
import { bloggersCollection } from "./db"

export const bloggersRepository = {
    async getBloggers(
        filter: FilterBloggers, 
        skip: number,
        limit: number,
    ): Promise<Blogger[]> {
        const bloggers = await bloggersCollection.find(filter).skip(skip).limit(limit).toArray();

        return deleteObjectsId(bloggers) as Blogger[];
    },

    async getCountBloggers(
        filter: FilterBloggers, 
    ): Promise<number> {
        const count = await bloggersCollection.count(filter)

        return count;
    },

    async getBloggerById(id: number): Promise<Blogger | null> {
        const blogger = await bloggersCollection.findOne({ id })

        return blogger ? deleteObjectId<Blogger>(blogger) : blogger
    },

    async createBlogger(newBlogger: Blogger): Promise<Blogger> {
        await bloggersCollection.insertOne(newBlogger)

        return deleteObjectId<Blogger>(newBlogger);
    },

    async deleteBloggerById(id: number) {
        const result = await bloggersCollection.deleteOne({ id })

        return result.deletedCount === 1;
    },

    async updateBloggerById(id: number, {name, youtubeUrl}: { name: string, youtubeUrl: string }) {
        const result = await bloggersCollection.updateOne(
            { id }, 
            { $set: { name, youtubeUrl }}
        )

        return result.matchedCount === 1;
    }
}