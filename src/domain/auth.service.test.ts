import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { JwtUtility } from '../heplers/JwtUtility';
import { AuthRepository } from '../repository/auth-repository';
import { BadRefreshTokensModel, UsersModel } from '../repository/models.mongoose';
import { UsersRepository } from '../repository/users-repository';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe("Auth service", () => {
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

    const usersRepository = new UsersRepository(UsersModel)
    const usersService = new UsersService(usersRepository);
    const emailManager: any = {}
    const authRepository = new AuthRepository(BadRefreshTokensModel)

    const jwtUtility = new JwtUtility()
    const authService = new AuthService(
        usersService,
        emailManager,
        jwtUtility,
        authRepository,
    )


    describe("createTokensByUserId", () => {
        it("Should return both access token and refresh token", async () => {
            const userId = '123'
            const tokens = await authService.createTokensByUserId(userId)

            expect(tokens.access).not.toBeUndefined()
            expect(tokens.refresh).not.toBeUndefined()
            expect(authService.jwtUtility.checkRefreshToken(tokens.refresh)).toBeTruthy()
        })
    })

    describe("canRefreshedTokens", () => {
        it("Should return false when refresh token is invalidate", async () => {
            const canRefreshed = await authService.canRefreshedTokens("jjj.jjj.jjj")

            expect(canRefreshed).toBeFalsy()
        })

        it("Should return false when refresh token is from black list", async () => {
            const userId = '123'
            const { refresh: refreshToken } = await authService.createTokensByUserId(userId)
            
            await authRepository.addToBadRefreshTokens(userId, refreshToken)

            const canRefreshed = await authService.canRefreshedTokens(refreshToken)

            expect(canRefreshed).toBeFalsy()
        })

        it("Should return true when refresh token is valid", async () => {
            await authRepository.clearBlackListRefreshTokens();
            
            const userId = '123'
            const { refresh: refreshToken } = await authService.createTokensByUserId(userId)
            
            const canRefreshed = await authService.canRefreshedTokens(refreshToken)

            expect(canRefreshed).toBeTruthy()
        })
    })
})