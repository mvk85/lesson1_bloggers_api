import { ObjectId } from "mongodb";
import { bloggersRepository } from "../repository/bloggers-repository";
import { postsRepository } from "../repository/posts-repository";
import { Blogger, FilterBloggersParams, PaginationParams, ResponseBloggers, ResponsePostsByBloggerId } from "../types";
import { generateCustomId, generatePaginationData } from "../utils";

export const bloggersService = {
    async getBloggers(
        filterParams: FilterBloggersParams = {}, 
        paginationParams: PaginationParams
    ): Promise<ResponseBloggers> {
        const filter = filterParams.SearchNameTerm 
        ? { name: { $regex: filterParams.SearchNameTerm }} 
        : {};

        const bloggersCount = await bloggersRepository.getCountBloggers(filter);
        const paginationData = generatePaginationData(paginationParams, bloggersCount)

        const bloggers = await bloggersRepository.getBloggers(
            filter, paginationData.skip, paginationData.pageSize
        );

        return {
            items: bloggers,
            pagesCount: paginationData.pagesCount,
            pageSize: paginationData.pageSize,
            totalCount: bloggersCount,
            page: paginationData.pageNumber
        };
    },

    async getPostsByBloggerId(
        bloggerId: string, 
        paginationParams: PaginationParams
    ): Promise<ResponsePostsByBloggerId> {
        const filter = { bloggerId };
        const postsCount = await postsRepository.getCountPosts(filter);
        const paginationData = generatePaginationData(paginationParams, postsCount)

        const posts = await postsRepository.getPosts(
            filter, paginationData.skip, paginationData.pageSize
        );

        return {
            items: posts,
            pagesCount: paginationData.pagesCount,
            pageSize: paginationData.pageSize,
            totalCount: postsCount,
            page: paginationData.pageNumber
        };
    },

    async getBloggerById(id: string): Promise<Blogger | null> {
        const blogger = await bloggersRepository.getBloggerById(id)

        return blogger
    },

    async createBlogger(name: string, youtubeUrl: string) {
        const newBloggers: Blogger = {
            _id: new ObjectId(),
            id: generateCustomId(),
            name,
            youtubeUrl
        }

        const createdBlogger = await bloggersRepository.createBlogger(newBloggers)

        return createdBlogger;
    },

    async deleteBloggerById(id: string) {
        const isDeleted = await bloggersRepository.deleteBloggerById(id);

        return isDeleted;
    },

    async updateBloggerById(id: string, data: { name: string, youtubeUrl: string }) {
        const isUpdated = await bloggersRepository.updateBloggerById(id, data);

        return isUpdated;
    }
}