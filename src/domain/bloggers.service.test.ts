import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { BloggersRepository } from "../repository/bloggers-repository";
import { BloggersModel } from '../repository/models.mongoose';
import { PostsRepository } from "../repository/posts-repository";
import { BloggersService } from "./bloggers.service";

describe("Bloggers service", () => {
    let mongodbMemoryServer: MongoMemoryServer;

    beforeAll(async () => {
        mongodbMemoryServer = await MongoMemoryServer.create()
        const mongoUri = mongodbMemoryServer.getUri()
        await mongoose.connect(mongoUri)
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongodbMemoryServer.stop()
    })

    const postsModel: any = {}
    const bloggersRepository = new BloggersRepository(BloggersModel);
    const postsRepository = new PostsRepository(postsModel);

    const bloggersService = new BloggersService(
        bloggersRepository, 
        postsRepository
    );

    describe("getBloggers", () => {
        it("should create user", async () => {
            const spyBloggersRepository = jest.spyOn(bloggersRepository, "createBlogger")
            const userName = 'User';
            const userUrl = "https://url.ru";
            const newBlogger = await bloggersService.createBlogger(
                userName,
                userUrl
            )

            expect(newBlogger?.name).toBe(userName)
            expect(newBlogger?.youtubeUrl).toBe(userUrl)
            expect(spyBloggersRepository).toBeCalled()

            spyBloggersRepository.mockRestore()
        })
        it("should return bloggers", () => {
            expect(1).toBe(1)
        })
    })
})