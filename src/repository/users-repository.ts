import { projectionUserItem } from "../const";
import { CreatedUserType, User } from "../types";
import { UsersModel } from "./models.mongoose";

export class UsersRepository {
    async getUsers(skip: number, limit: number): Promise<User[]> {
        const users = await UsersModel
            .find({})
            .select(projectionUserItem)
            .skip(skip)
            .limit(limit)
            .lean();

        return users;
    }

    async getCountUsers(): Promise<number> {
        const count = await UsersModel.count({})

        return count;
    }

    async createUser(newUser: User): Promise<CreatedUserType | null> {
        await UsersModel.create(newUser);

        const user = await UsersModel.findOne({ id: newUser.id }).select(projectionUserItem)

        return user;
    }

    async deleteUserByid(id: string): Promise<boolean> {
        const result = await UsersModel.deleteOne({ id })

        return result.deletedCount === 1;
    }

    async findUserByLogin(login: string): Promise<User | null> {
        const user = await UsersModel.findOne({ login })

        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user = await UsersModel.findOne({ email })

        return user;
    }

    async findUserByUserId(id: string): Promise<User | null> {
        const user = await UsersModel.findOne({ id })

        return user;
    }

    async findUserByConfirmationCode(code: string): Promise<User | null> {
        const user = await UsersModel.findOne({ confirmCode: code })

        return user;
    }

    async deleteAllUsers() {
        await UsersModel.deleteMany({})
    }

    async registrationConfirmed(id: string): Promise<boolean> {
        const resultUpdating = await UsersModel.updateOne(
            { id },
            { $set: { isConfirmed: true } }
        )

        return resultUpdating.matchedCount === 1;
    }

    async updateConfirmationCode(id: string, code: string) {
        const resultUpdating = await UsersModel.updateOne(
            { id },
            { $set: { confirmCode: code } }
        )

        return resultUpdating.matchedCount === 1;
    }
}
