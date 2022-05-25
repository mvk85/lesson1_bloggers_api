import { ObjectId } from "mongodb";
import { usersRepository } from "../repository/users-repository";
import { PaginationParams, ResponseUsers, User, UserCreateFields } from "../types";
import { generatePaginationData } from "../utils";
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

    async addUser(fields: UserCreateFields) {
        const passwordHash = await authService.generateHash(fields.password)
        const newUser: User = {
            _id: new ObjectId(),
            id: +(new Date()),
            login: fields.login,
            passwordHash
        }

        const createdUser = await usersRepository.createUser(newUser);

        return createdUser;
    },

    async deleteUserById(id: string) {
        const isDeleted = await usersRepository.deleteUserByid(Number(id));

        return isDeleted;
    }
}