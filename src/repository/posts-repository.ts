import { removeObjectIdOption } from "../const";
import { Post, PostCreateFields } from "../types";
import { postsCollection } from "./db"

export const postsRepository = {
    async getPosts(filter: object = {}, skip: number, limit: number,): Promise<Post[]> {
        const posts = await postsCollection.find(filter, removeObjectIdOption).skip(skip).limit(limit).toArray();

        return posts;
    },

    async getCountPosts(filter: object = {}): Promise<number> {
        const count = await postsCollection.count(filter)

        return count;
    },

    async getPostById(id: string): Promise<Post | null> {
        const post = await postsCollection.findOne({ id }, removeObjectIdOption)
        
        return post;
    },

    async createPost(newPost: Post): Promise<Post | null> {
        await postsCollection.insertOne(newPost)
        
        const post = await postsCollection.findOne({ id: newPost.id }, removeObjectIdOption)

        return post;
    },

    async deletePostById(id: string) {
        const result = await postsCollection.deleteOne({ id })

        return result.deletedCount === 1;        
    },

    async updatePostById(id: string, fields: PostCreateFields) {
        const result = await postsCollection.updateOne({ id }, {$set: { ...fields }});

        return result.matchedCount === 1;
    },

    async deleteAllPosts() {
        await postsCollection.deleteMany({})
    }
}