import { bloggersRepository } from "../repository/bloggers-repository";
import { Blogger, FilterBloggersParams, PaginationParams, ResponseBloggers } from "../types";
import { generatePaginationData } from "../utils";

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

    async getBloggerById(id: number): Promise<Blogger | null> {
        const blogger = await bloggersRepository.getBloggerById(id)

        return blogger
    },

    async createBlogger(name: string, youtubeUrl: string) {
        const newBloggers: Blogger = {
            id: +(new Date()),
            name,
            youtubeUrl
        }

        await bloggersRepository.createBlogger(newBloggers)

        return newBloggers;
    },

    async deleteBloggerById(id: number) {
        const isDeleted = await bloggersRepository.deleteBloggerById(id);

        return isDeleted;
    },

    async updateBloggerById(id: number, data: { name: string, youtubeUrl: string }) {
        const isUpdated = await bloggersRepository.updateBloggerById(id, data);

        return isUpdated;
    }
}