import { ObjectId } from "mongodb";
import { usersRepository } from "../repository/users-repository";
import { PaginationParams, ResponseUsers, User, CreateUserFields } from "../types";
import { generateConfirmCode, generateCustomId, generatePaginationData } from "../utils";
import { authService } from "./auth.service";

export const usersService = {
    async getUsers(paginationParams: PaginationParams): Promise<ResponseUsers> {
        const usersCount = await usersRepository.getCountUsers();
        const { skip, pageSize, pagesCount, pageNumber } = generatePaginationData(paginationParams, usersCount)

        const users = await usersRepository.getUsers(skip, pageSize)

        return {
            items: users,
            pagesCount,
            pageSize,
            totalCount: usersCount,
            page: pageNumber
        }
    },

    async addUser(fields: CreateUserFields) {
        const passwordHash = await authService.generateHash(fields.password)
        const newUser: User = {
            _id: new ObjectId(),
            id: generateCustomId(),
            login: fields.login,
            passwordHash,
            email: fields.email,
            isConfirmed: true,
        }

        const createdUser = await usersRepository.createUser(newUser);

        return createdUser;
    },

    async makeRegisteredUser(fields: CreateUserFields) {
        const passwordHash = await authService.generateHash(fields.password)
        const newUser: User = {
            _id: new ObjectId(),
            id: generateCustomId(),
            login: fields.login,
            passwordHash,
            email: fields.email,
            isConfirmed: false,
            confirmCode: generateConfirmCode()
        }

        const createdUser = await usersRepository.createUser(newUser);

        return createdUser;
    },

    async deleteUserById(id: string) {
        const isDeleted = await usersRepository.deleteUserByid(id);

        return isDeleted;
    },

    async updateConfirmationCode(user: User) {
        const newCode = generateConfirmCode();
        const isUpdated = await usersRepository.updateConfirmationCode(
            user.id, newCode
        );

        return isUpdated;
    }
}