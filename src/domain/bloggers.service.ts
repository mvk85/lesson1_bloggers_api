import { ObjectId } from "mongodb";
import { BloggersRepository } from "../repository/bloggers-repository";
import { PostsRepository } from "../repository/posts-repository";
import { Blogger, FilterBloggersParams, PaginationParams, ResponseBloggers, ResponsePostsByBloggerId } from "../types";
import { generateCustomId, generatePaginationData } from "../utils";

export class BloggersService {
    bloggersRepository: BloggersRepository

    postsRepository: PostsRepository

    constructor() {
        this.bloggersRepository = new BloggersRepository();
        this.postsRepository = new PostsRepository();
    }

    async getBloggers(
        filterParams: FilterBloggersParams = {},
        paginationParams: PaginationParams
    ): Promise<ResponseBloggers> {
        const filter = filterParams.SearchNameTerm
            ? { name: { $regex: filterParams.SearchNameTerm } }
            : {};

        const bloggersCount = await this.bloggersRepository.getCountBloggers(filter);
        const paginationData = generatePaginationData(paginationParams, bloggersCount)

        const bloggers = await this.bloggersRepository.getBloggers(
            filter, paginationData.skip, paginationData.pageSize
        );

        return {
            items: bloggers,
            pagesCount: paginationData.pagesCount,
            pageSize: paginationData.pageSize,
            totalCount: bloggersCount,
            page: paginationData.pageNumber
        };
    }

    async getPostsByBloggerId(
        bloggerId: string,
        paginationParams: PaginationParams
    ): Promise<ResponsePostsByBloggerId> {
        const filter = { bloggerId };
        const postsCount = await this.postsRepository.getCountPosts(filter);
        const paginationData = generatePaginationData(paginationParams, postsCount)

        const posts = await this.postsRepository.getPosts(
            filter, paginationData.skip, paginationData.pageSize
        );

        return {
            items: posts,
            pagesCount: paginationData.pagesCount,
            pageSize: paginationData.pageSize,
            totalCount: postsCount,
            page: paginationData.pageNumber
        };
    }

    async getBloggerById(id: string): Promise<Blogger | null> {
        const blogger = await this.bloggersRepository.getBloggerById(id)

        return blogger
    }

    async createBlogger(name: string, youtubeUrl: string) {
        const newBloggers: Blogger = new Blogger(
            new ObjectId(),
            generateCustomId(),
            name,
            youtubeUrl
        )

        const createdBlogger = await this.bloggersRepository.createBlogger(newBloggers)

        return createdBlogger;
    }

    async deleteBloggerById(id: string) {
        const isDeleted = await this.bloggersRepository.deleteBloggerById(id);

        return isDeleted;
    }

    async updateBloggerById(id: string, data: { name: string, youtubeUrl: string }) {
        const isUpdated = await this.bloggersRepository.updateBloggerById(id, data);

        return isUpdated;
    }
}

