import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { CommentsService } from "../domain/comments.service";
import { JwtUtility } from "../heplers/JwtUtility";
import { UsersRepository } from "../repository/users-repository";

const logopass = 'admin:qwerty';
const logopassBase64 = Buffer.from(logopass).toString('base64')

@injectable()
export class AuthChecker {
    constructor(
        protected usersRepository: UsersRepository,
        protected commentsService: CommentsService,
        public jwtUtility: JwtUtility,
    ) {}

    checkAdminBasicAuth (req: Request, res: Response, next: NextFunction) {
        const headers = req.headers;
        const authHeaderString = headers.authorization;
        const [authType, authHeader] = authHeaderString?.split(' ') || [];
        
        if (authHeader === logopassBase64 && authType === 'Basic') {
            next();
        } else {
            res.sendStatus(401)
        }
    }
    
    async checkUserBearerAuth(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.sendStatus(401)
    
            return;
        }
    
        const token = req.headers.authorization.split(' ')[1]
    
        const userId = await this.jwtUtility.getUserIdByToken(token);
    
        if (!userId) {
            res.sendStatus(401)
    
            return;
        }
    
        const user = await this.usersRepository.findUserByUserId(userId);
    
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
    
    async checkCommentCredentials(req: Request, res: Response, next: NextFunction) {
            const commentId = req.params.id;
            const userId = req.user!.userId;
            const currentComment = await this.commentsService.getById(commentId)
            
            if (userId !== currentComment?.userId) {
                res.sendStatus(403)
    
                return;
            }     
    
            next();
    }
}
