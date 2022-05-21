import { Post, PostCreateFields } from "../types";
import { deleteObjectId, deleteObjectsId } from "../utils";
import { postsCollection } from "./db"

export const postsRepository = {
    async getPosts(skip: number, limit: number,): Promise<Post[]> {
        const posts = await postsCollection.find({}).skip(skip).limit(limit).toArray();

        return deleteObjectsId(posts) as Post[];
    },

    async getCountPosts(): Promise<number> {
        const count = await postsCollection.count({})

        return count;
    },

    async getPostById(id: number): Promise<Post | null> {
        const post = await postsCollection.findOne({ id })
        
        return post ? deleteObjectId(post) : post;
    },

    async createPost(newPost: Post): Promise<Post | null> {
        await postsCollection.insertOne(newPost)

        return deleteObjectId(newPost);
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