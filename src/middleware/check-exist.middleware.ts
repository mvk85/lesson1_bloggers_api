import { NextFunction, Request, Response } from "express";
import { commentsService } from "../domain/comments.service";
import { postsService } from "../domain/posts.service";

export const checkPostExist = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const foundPost = await postsService.getPostById(postId);

    if (!foundPost) {
        res.sendStatus(404)

        return;
    }

    next()
}

export const checkCommentExist = 
    async (req: Request, res: Response, next: NextFunction) => {
        const commentId = req.params.id;
        const currentComment = await commentsService.getById(commentId)

        if (!currentComment) {
            res.sendStatus(404)

            return;
        }

        next();
}