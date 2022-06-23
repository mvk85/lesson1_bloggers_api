import mongoose from 'mongoose';
import { Blogger, BruteForceItem, Comment, Post, User } from "../types";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const dbName = process.env.mongoDBName || 'social';

const bloggersModelName = 'bloggers';
const usersModelName = 'users';
const postsModelName = 'posts';
const commentsModelName = 'comments';
const requestsModelName = 'requests';

const bloggersSchema = new mongoose.Schema<Blogger>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
})

const usersSchema = new mongoose.Schema<User>({
    passwordHash: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true },
    confirmCode: { type: String, default: null },
    id:	{ type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
})

const postsSchema = new mongoose.Schema<Post>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    bloggerId: { type: String, required: true },
    bloggerName: { type: String, required: true }
})

const commentsSchema = new mongoose.Schema<Comment>({
    id: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    addedAt: { type: String, required: true },
    postId: { type: String, required: true },
})

const requestsSchema = new mongoose.Schema<BruteForceItem>({
    ip: { type: String, required: true },
    date: { type: Number, required: true },
    endpoint: { type: String, required: true },
})

export const BloggersModel = mongoose.model(bloggersModelName, bloggersSchema)
export const UsersModel = mongoose.model(usersModelName, usersSchema)
export const PostsModel = mongoose.model(postsModelName, postsSchema)
export const CommentsModel = mongoose.model(commentsModelName, commentsSchema)
export const RequestsModel = mongoose.model(requestsModelName, requestsSchema)

export async function runDb() {
    try {
        await mongoose.connect(mongoUri, { dbName })

        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
