import { ObjectId } from "mongodb";
import { bloggersRepository } from "../repository/bloggers-repository";
import { postsRepository } from "../repository/posts-repository";
import { Post, PostCreateFields } from "../types";

export const postsService = {
    async getPosts(filter: {} = {}): Promise<Post[]> {
        const posts = await postsRepository.getPosts(filter);

        return posts;
    },

    async getPostById(id: number): Promise<Post | null> {
        const post = await postsRepository.getPostById(id);
        
        return post;
    },

    async createPost(fields: PostCreateFields): Promise<Post | null> {
        const blogger = await bloggersRepository.getBloggerById(fields.bloggerId);

        if (!blogger) return null;

        const newPosts: Post = {
            _id: new ObjectId(),
            id: +(new Date()),
            title: fields.title,
            shortDescription: fields.shortDescription,
            content: fields.content,
            bloggerId: blogger.id,
            bloggerName: blogger.name
        }

        await postsRepository.createPost(newPosts)

        return newPosts;
    },

    async deletePostById(id: number) {
        const isDeleted = await postsRepository.deletePostById(id);

        return isDeleted;        
    },

    async updatePostById(id: number, fields: PostCreateFields) {
        const isUpdated = await postsRepository.updatePostById(id, fields);

        return isUpdated;
    }
}