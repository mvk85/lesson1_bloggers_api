import { inject, injectable } from "inversify";
import { projectionCreateUserItem, projectionUserItem } from "../const";
import { CreatedUserType, User } from "../types";
import { UsersModel } from "./models.mongoose";

@injectable()
export class UsersRepository {
    constructor(
        @inject(UsersModel) private usersModel: typeof UsersModel
    ) {}

    async getUsers(skip: number, limit: number): Promise<User[]> {
        const users = await this.usersModel
            .find({})
            .select(projectionUserItem)
            .skip(skip)
            .limit(limit)
            .lean();

        return users;
    }

    async getCountUsers(): Promise<number> {
        const count = await this.usersModel.count({})

        return count;
    }

    async createUser(newUser: User): Promise<CreatedUserType | null> {
        await this.usersModel.create(newUser);

        const user = await this.usersModel.findOne({ id: newUser.id }).select(projectionCreateUserItem)

        return user;
    }
    
    async makeRegisteredUser(newUser: User): Promise<CreatedUserType | null> {
        await this.usersModel.create(newUser);

        const user = await this.usersModel.findOne({ id: newUser.id }).select(projectionUserItem)

        return user;
    }
    
    async deleteUserByid(id: string): Promise<boolean> {
        const result = await this.usersModel.deleteOne({ id })

        return result.deletedCount === 1;
    }

    async findUserByLogin(login: string): Promise<User | null> {
        const user = await this.usersModel.findOne({ login })

        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user = await this.usersModel.findOne({ email })

        return user;
    }

    async findUserByUserId(id: string): Promise<User | null> {
        const user = await this.usersModel.findOne({ id })

        return user;
    }

    async findUserByConfirmationCode(code: string): Promise<User | null> {
        const user = await this.usersModel.findOne({ confirmCode: code })

        return user;
    }

    async deleteAllUsers() {
        await this.usersModel.deleteMany({})
    }

    async registrationConfirmed(id: string): Promise<boolean> {
        const resultUpdating = await this.usersModel.updateOne(
            { id },
            { $set: { isConfirmed: true } }
        )

        return resultUpdating.matchedCount === 1;
    }

    async updateConfirmationCode(id: string, code: string) {
        const resultUpdating = await this.usersModel.updateOne(
            { id },
            { $set: { confirmCode: code } }
        )

        return resultUpdating.matchedCount === 1;
    }
}
