import { removeObjectIdOption } from "../const";
import { Comment, FilterComments } from "../types";
import { commentsCollection } from "./db";

export const commentsRepository = {
    async getCountComments(filter: FilterComments): Promise<number> {
        const count = await commentsCollection.count(filter)

        return count;
    },

    async getComments(filter: FilterComments, skip: number, limit: number) {
        const comments = await commentsCollection
            .find(filter, { projection: {_id: false, postId: false }})
            .skip(skip)
            .limit(limit)
            .toArray();

        return comments
    },

    async createComment(newComment: Comment) {
        await commentsCollection.insertOne(newComment)

        const createdComment = await commentsCollection.findOne({ id: newComment.id }, removeObjectIdOption)

        return createdComment;
    }
}