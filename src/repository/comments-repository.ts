import { commentsProjection } from "../const";
import { Comment, FilterComments } from "../types";
import { CommentsModel } from "./models.mongoose";

export const commentsRepository = {
    async getCountComments(filter: FilterComments): Promise<number> {
        const count = await CommentsModel.count(filter)

        return count;
    },

    async getComments(filter: FilterComments, skip: number, limit: number) {
        const comments = await CommentsModel
            .find(filter, commentsProjection)
            .skip(skip)
            .limit(limit)
            .lean();

        return comments
    },

    async createComment(newComment: Comment) {
        await CommentsModel.create(newComment)

        const createdComment = await CommentsModel.findOne(
            { id: newComment.id }, 
            commentsProjection
        )

        return createdComment;
    },

    async getCommentByid(id: string) {
        const comment = await CommentsModel.findOne({ id }, commentsProjection)

        return comment;
    },

    async deleteCommentById(id: string) {
        const result = await CommentsModel.deleteOne({ id })

        return result.deletedCount === 1;
    },

    async updateCommentById(id: string, { content }: { content: string }) {
        const result = await CommentsModel.updateOne(
            { id },
            { $set: { content }}
        )

        return result.matchedCount === 1;
    },

    async deleteAllComments() {
        await CommentsModel.deleteMany({})
    }
}