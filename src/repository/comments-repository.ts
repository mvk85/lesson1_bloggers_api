import { removeObjectIdOption } from "../const";
import { Comment, FilterComments } from "../types";
import { commentsCollection } from "./db";

const commentsProjection = { projection: {_id: false, postId: false }};

export const commentsRepository = {
    async getCountComments(filter: FilterComments): Promise<number> {
        const count = await commentsCollection.count(filter)

        return count;
    },

    async getComments(filter: FilterComments, skip: number, limit: number) {
        const comments = await commentsCollection
            .find(filter, commentsProjection)
            .skip(skip)
            .limit(limit)
            .toArray();

        return comments
    },

    async createComment(newComment: Comment) {
        await commentsCollection.insertOne(newComment)

        const createdComment = await commentsCollection.findOne(
            { id: newComment.id }, 
            commentsProjection
        )

        return createdComment;
    },

    async getCommentByid(id: string) {
        const comment = await commentsCollection.findOne({ id }, commentsProjection)

        return comment;
    },

    async deleteCommentById(id: string) {
        const result = await commentsCollection.deleteOne({ id })

        return result.deletedCount === 1;
    },

    async updateCommentById(id: string, { content }: { content: string }) {
        const result = await commentsCollection.updateOne(
            { id },
            { $set: { content }}
        )

        return result.matchedCount === 1;
    }
}