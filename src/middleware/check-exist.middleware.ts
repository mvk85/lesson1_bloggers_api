import { NextFunction, Request, Response } from "express";
import { CommentsService } from "../domain/comments.service";
import { PostsService } from "../domain/posts.service";

export class ExistenceChecker {
    commentsService: CommentsService
    
    postsService: PostsService

    constructor() {
        this.commentsService = new CommentsService()
        this.postsService = new PostsService()
    }

    async checkPostExist(req: Request, res: Response, next: NextFunction) {
        const postId = req.params.id;
        const foundPost = await this.postsService.getPostById(postId);
    
        if (!foundPost) {
            res.sendStatus(404)
    
            return;
        }
    
        next()
    }
    
    async checkCommentExist(req: Request, res: Response, next: NextFunction) {
            const commentId = req.params.id;
            const currentComment = await this.commentsService.getById(commentId)
    
            if (!currentComment) {
                res.sendStatus(404)
    
                return;
            }
    
            next();
    }
}
