import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { JwtUtility } from '../heplers/JwtUtility';
import { AuthRepository } from '../repository/auth-repository';
import { BadRefreshTokensModel, UsersModel } from '../repository/models.mongoose';
import { MeItem } from '../types';
import { AuthService } from './auth.service';
import TestHelper from './auth.service.test-helper';

jest.setTimeout(1000 * 100)

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

    
    const emailManagerMock: any = {
        sendRegistrationCode: jest.fn()
    }
    
    const authRepository = new AuthRepository(BadRefreshTokensModel)
    const helper = new TestHelper();

    const jwtUtility = new JwtUtility()
    const authService = new AuthService(
        helper.usersService,
        emailManagerMock,
        jwtUtility,
        authRepository,
    )

    // expect.setState({ authRepository })
    // expect.getState().authRepository

    describe("createTokensByUserId", () => {
        beforeAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })

        it("Should return both access token and refresh token", async () => {
            const userId = '123'
            const tokens = await authService.createTokensByUserId(userId)

            expect(tokens.access).not.toBeUndefined()
            expect(tokens.refresh).not.toBeUndefined()
            expect(authService.jwtUtility.checkRefreshToken(tokens.refresh)).toBeTruthy()
        })
    })

    describe("canRefreshedTokens", () => {
        beforeAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })

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

    describe("me", () => {
        beforeAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })

        it("Should return null when user don't exist", async () => {
            const userId = "1"

            const meData = await authService.me(userId)

            expect(meData).toBeNull()
        })

        it("Should return me data when user exist", async () => {
            const login = 'test';
            const password = '123';
            const email = 'test@test.ru';

            const newUser = await helper.makeRegistrationUser(login, password, email)
            const meData = await authService.me(newUser!.id)

            const expectedResult: MeItem = {
                userId: newUser!.id,
                email: newUser!.email,
                login: newUser!.login
            } 

            expect(meData).toEqual(expectedResult)
        })
    })

    describe("registration", () => {
        beforeAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })

        it("Should sended email when fields of registration is correct", async () => {
            // Arrange inputs and targets (договоренности)
            const login = 'test';
            const password = '123456';
            const email = 'test@test.ru';
            const userFields = {
                login,
                password,
                email
            }
            const spyMakeRegisteredUser = jest.spyOn(helper.usersService, 'makeRegisteredUser')
            const spyGetUserById = jest.spyOn(helper.usersService, 'getUserById')
            
            emailManagerMock.sendRegistrationCode.mockImplementation(() => true)

            // act
            const isRegistration = await authService.registration(userFields)

            //assert - утверждать
            expect(isRegistration).toBeTruthy()
            expect(emailManagerMock.sendRegistrationCode).toBeCalled()
            expect(spyMakeRegisteredUser).toBeCalledWith(userFields)
            expect(spyGetUserById).toBeCalled()

            spyMakeRegisteredUser.mockReset()
            spyGetUserById.mockReset()
        })
    })
})
