import { commentsRepository } from "../repository/comments-repository"

export const commentsService = {
    async deleteById(id: string) {
        const isDeleted = await commentsRepository.deleteCommentById(id);

        return isDeleted;
    },

    async getById(id: string) {
        const comments = await commentsRepository.getCommentByid(id);

        return comments;
    },

    async updateByid(id: string, fields: { content: string }) {
        const isUpdated = await commentsRepository.updateCommentById(id, fields)

        return isUpdated;
    }
}