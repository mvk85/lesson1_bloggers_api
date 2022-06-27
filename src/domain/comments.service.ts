import { commentsRepository } from "../repository/comments-repository"

class CommentsService {
    async deleteById(id: string) {
        const isDeleted = await commentsRepository.deleteCommentById(id);

        return isDeleted;
    }

    async getById(id: string) {
        const comments = await commentsRepository.getCommentByid(id);

        return comments;
    }

    async updateById(id: string, fields: { content: string }) {
        const isUpdated = await commentsRepository.updateCommentById(id, fields)

        return isUpdated;
    }
}

export const commentsService = new CommentsService();
