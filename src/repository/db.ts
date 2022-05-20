import {MongoClient} from 'mongodb'
import { Blogger, Post } from "../types";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const nameDb = 'social';

export const client = new MongoClient(mongoUri);

export const bloggersCollection = client.db(nameDb).collection<Blogger>('bloggers')
export const postsCollection = client.db(nameDb).collection<Post>('posts')

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db(nameDb).command({ ping: 1 });
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
