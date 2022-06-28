import { NextFunction, Request, Response } from "express";
import { BloggersService } from "../domain/bloggers.service";

export class BloggerValidator {
    bloggersService: BloggersService

    constructor() {
        this.bloggersService = new BloggersService()
    }

    async bloggerIdValidation(req: Request, res: Response, next: NextFunction) {
        const blogger = await this.bloggersService.getBloggerById(req.params.id);

        if (!blogger) {
            res.sendStatus(404)

            return;
        }

        next();
    }

}
