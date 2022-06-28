import { CommentsRepository } from "../repository/comments-repository"

export class CommentsService {
    commentsRepository: CommentsRepository

    constructor() {
        this.commentsRepository = new CommentsRepository();
    }
    
    async deleteById(id: string) {
        const isDeleted = await this.commentsRepository.deleteCommentById(id);

        return isDeleted;
    }

    async getById(id: string) {
        const comments = await this.commentsRepository.getCommentByid(id);

        return comments;
    }

    async updateById(id: string, fields: { content: string }) {
        const isUpdated = await this.commentsRepository.updateCommentById(id, fields)

        return isUpdated;
    }
}
