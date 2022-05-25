import { ObjectId } from "mongodb";
import { bloggersRepository } from "../repository/bloggers-repository";
import { postsRepository } from "../repository/posts-repository";
import { PaginationParams, Post, PostCreateFields, ResponsePosts } from "../types";
import { generateCustomId, generatePaginationData } from "../utils";

export const postsService = {
    async getPosts(paginationParams: PaginationParams): Promise<ResponsePosts> {
        const postsCount = await postsRepository.getCountPosts();
        const paginationData = generatePaginationData(paginationParams, postsCount)

        const posts = await postsRepository.getPosts(
            {}, paginationData.skip, paginationData.pageSize
        );

        return {
            items: posts,
            pagesCount: paginationData.pagesCount,
            pageSize: paginationData.pageSize,
            totalCount: postsCount,
            page: paginationData.pageNumber
        };
    },

    async getPostById(id: string): Promise<Post | null> {
        const post = await postsRepository.getPostById(id);
        
        return post;
    },

    async createPost(fields: PostCreateFields): Promise<Post | null> {
        const blogger = await bloggersRepository.getBloggerById(fields.bloggerId);

        if (!blogger) return null;

        const newPosts: Post = {
            _id: new ObjectId(),
            id: generateCustomId(),
            title: fields.title,
            shortDescription: fields.shortDescription,
            content: fields.content,
            bloggerId: blogger.id,
            bloggerName: blogger.name
        }

        const createdPost = await postsRepository.createPost(newPosts)

        return createdPost;
    },

    async deletePostById(id: string) {
        const isDeleted = await postsRepository.deletePostById(id);

        return isDeleted;        
    },

    async updatePostById(id: string, fields: PostCreateFields) {
        const isUpdated = await postsRepository.updatePostById(id, fields);

        return isUpdated;
    }
}