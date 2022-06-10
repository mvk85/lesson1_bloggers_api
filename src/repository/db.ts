import {MongoClient} from 'mongodb'
import { Blogger, Comment, EmailEntity, Post, User } from "../types";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const nameDb = 'social';

const client = new MongoClient(mongoUri);
const db = client.db(nameDb);

export const bloggersCollection = db.collection<Blogger>('bloggers')
export const postsCollection = db.collection<Post>('posts')
export const usersCollection = db.collection<User>('users')
export const commentsCollection = db.collection<Comment>('comments')
export const emailCollection = db.collection<EmailEntity>('emails')

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await db.command({ ping: 1 });
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
