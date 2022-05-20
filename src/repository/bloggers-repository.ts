import { Blogger } from "../types";
import { bloggersCollection } from "./db"

export const bloggersRepository = {
    async getBloggers(filter: {}): Promise<Blogger[]> {
        const bloggers = await bloggersCollection.find(filter).toArray();

        return bloggers;
    },

    async getBloggerById(id: number): Promise<Blogger | null> {
        const blogger = await bloggersCollection.findOne({ id })

        return blogger
    },

    async createBlogger(newBlogger: Blogger): Promise<Blogger | null> {
        await bloggersCollection.insertOne(newBlogger)

        return newBlogger;
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