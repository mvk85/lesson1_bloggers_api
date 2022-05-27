import { NextFunction, Request, Response } from "express";
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