import { NextFunction, Request, Response } from "express";
import { commentsService } from "../domain/comments.service";
import { usersRepository } from "../repository/users-repository";
import { jwtUtility } from "../utils";

const logopass = 'admin:qwerty';
const logopassBase64 = Buffer.from(logopass).toString('base64')

export const checkAdminBasicAuth = (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;
    const authHeaderString = headers.authorization;
    const [authType, authHeader] = authHeaderString?.split(' ') || [];
    
    if (authHeader === logopassBase64 && authType === 'Basic') {
        next();
    } else {
        res.sendStatus(401)
    }
}

export const checkUserBearerAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)

        return;
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtUtility.getUserIdByToken(token);

    if (!userId) {
        res.sendStatus(401)

        return;
    }

    const user = await usersRepository.getUserByUserId(userId);

    if (user) {
        req.user = { 
            userId: user.id,
            userLogin: user.login
        }
        next()
    } else {
        res.sendStatus(401)

        return;
    }
}

export const checkCommentCredentialsAndExist = 
    async (req: Request, res: Response, next: NextFunction) => {
        const commentId = req.params.id;
        const userId = req.user!.userId;
        const currentComment = await commentsService.getById(commentId)
        
        if (userId !== currentComment?.userId) {
            res.sendStatus(401)

            return;
        }

        if (!currentComment) {
            res.sendStatus(404)

            return;
        }

        

        next();
}