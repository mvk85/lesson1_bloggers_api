import { CreatedUserType, User } from "../types";
import { usersCollection } from "./db"

const projectionUserItem = { projection: {_id: false, id: true, login: true, email: true } };

export const usersRepository = {
   async getUsers(skip: number, limit: number): Promise<User[]> {
       const users = await usersCollection
        .find({}, projectionUserItem)
        .skip(skip)
        .limit(limit)
        .toArray();
       
       return users;
   },

   async getCountUsers(): Promise<number> {
       const count = await usersCollection.count({})

       return count;
   },

   async createUser(newUser: User): Promise<CreatedUserType | null> {
       await usersCollection.insertOne(newUser);

       const user = await usersCollection.findOne({ id: newUser.id}, projectionUserItem)

       return user;
   },

   async deleteUserByid(id: string): Promise<boolean> {
       const result = await usersCollection.deleteOne({ id })
       
       return result.deletedCount === 1;
   },

   async findUserByLogin(login: string): Promise<User | null> {
       const user = await usersCollection.findOne({ login })
       
       return user;
   },

   async findUserByEmail(email: string): Promise<User | null> {
       const user = await usersCollection.findOne({ email })
       
       return user;
   },

   async findUserByUserId(id: string): Promise<User | null> {
       const user = await usersCollection.findOne({ id })
       
       return user;
   },

   async findUserByConfirmationCode(code: string): Promise<User | null> {
       const user = await usersCollection.findOne({ confirmCode: code })
       
       return user;
   },

    async deleteAllUsers() {
        await usersCollection.deleteMany({})
    },

    async registrationConfirmed(id: string): Promise<boolean> {
        const resultUpdating = await usersCollection.updateOne(
            { id },
            { $set: { isConfirmed: true } }
        )

        return resultUpdating.matchedCount === 1;
    },

    async updateConfirmationCode(id: string, code: string) {
        const resultUpdating = await usersCollection.updateOne(
            { id },
            { $set: { confirmCode: code }}
        )

        return resultUpdating.matchedCount === 1;
    }
}