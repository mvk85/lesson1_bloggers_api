import { count } from "console";
import { removeObjectIdOption } from "../const"
import { User, UserItem } from "../types";
import { usersCollection } from "./db"

const projectionUserItem = { projection: {_id: false, id: true, login: true } };

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

   async createUser(newUser: User): Promise<UserItem | null> {
       await usersCollection.insertOne(newUser);

       const user = await usersCollection.findOne({ id: newUser.id}, projectionUserItem)

       return user;
   },

   async deleteUserByid(id: number): Promise<boolean> {
       const result = await usersCollection.deleteOne({ id })
       
       return result.deletedCount === 1;
   }
}