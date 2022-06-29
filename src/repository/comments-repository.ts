import { inject, injectable } from "inversify";
import { commentsProjection } from "../const";
import { Comment, FilterComments } from "../types";
import { CommentsModel } from "./models.mongoose";

@injectable()
export class CommentsRepository {
    constructor(
        @inject(CommentsModel) private commentsModel: typeof CommentsModel
    ){}

    async getCountComments(filter: FilterComments): Promise<number> {
        const count = await this.commentsModel.count(filter)

        return count;
    }

    async getComments(filter: FilterComments, skip: number, limit: number) {
        const comments = await this.commentsModel
            .find(filter, commentsProjection)
            .skip(skip)
            .limit(limit)
            .lean();

        return comments
    }

    async createComment(newComment: Comment) {
        await this.commentsModel.create(newComment)

        const createdComment = await this.commentsModel.findOne(
            { id: newComment.id }, 
            commentsProjection
        )

        return createdComment;
    }

    async getCommentByid(id: string) {
        const comment = await this.commentsModel.findOne({ id }, commentsProjection)

        return comment;
    }

    async deleteCommentById(id: string) {
        const result = await this.commentsModel.deleteOne({ id })

        return result.deletedCount === 1;
    }

    async updateCommentById(id: string, { content }: { content: string }) {
        const result = await this.commentsModel.updateOne(
            { id },
            { $set: { content }}
        )

        return result.matchedCount === 1;
    }

    async deleteAllComments() {
        await this.commentsModel.deleteMany({})
    }
}
