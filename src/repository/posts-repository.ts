import { removeObjectIdOption } from "../const";
import { Post, PostCreateFields } from "../types";
import { PostsModel } from "./models.mongoose";

class PostsRepository {
    async getPosts(filter: object = {}, skip: number, limit: number,): Promise<Post[]> {
        const posts = await PostsModel.find(filter, removeObjectIdOption)
            .skip(skip)
            .limit(limit)
            .lean();

        return posts;
    }

    async getCountPosts(filter: object = {}): Promise<number> {
        const count = await PostsModel.count(filter)

        return count;
    }

    async getPostById(id: string): Promise<Post | null> {
        const post = await PostsModel.findOne({ id }, removeObjectIdOption)
        
        return post;
    }

    async createPost(newPost: Post): Promise<Post | null> {
        await PostsModel.create(newPost)
        
        const post = await PostsModel.findOne({ id: newPost.id }, removeObjectIdOption)

        return post;
    }

    async deletePostById(id: string) {
        const result = await PostsModel.deleteOne({ id })

        return result.deletedCount === 1;        
    }

    async updatePostById(id: string, fields: PostCreateFields) {
        const result = await PostsModel.updateOne({ id }, {$set: { ...fields }});

        return result.matchedCount === 1;
    }

    async deleteAllPosts() {
        await PostsModel.deleteMany({})
    }
}

export const postsRepository = new PostsRepository();
