import { Post, PostCreateFields } from "../types";
import { postsCollection } from "./db"

export const postsRepository = {
    async getPosts(filter: {} = {}): Promise<Post[]> {
        const posts = await postsCollection.find(filter).toArray();

        return posts;
    },

    async getPostById(id: number): Promise<Post | null> {
        const post = await postsCollection.findOne({ id })
        
        return post;
    },

    async createPost(newPost: Post): Promise<Post | null> {
        await postsCollection.insertOne(newPost)

        return newPost;
    },

    async deletePostById(id: number) {
        const result = await postsCollection.deleteOne({ id })

        return result.deletedCount === 1;        
    },

    async updatePostById(id: number, fields: PostCreateFields) {
        const result = await postsCollection.updateOne({ id }, {$set: { ...fields }});

        return result.matchedCount === 1;
    }
}