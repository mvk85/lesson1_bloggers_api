import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { BloggersService } from "../domain/bloggers.service";

@injectable()
export class BloggerValidator {
    constructor(
        protected bloggersService: BloggersService
    ) {}

    async bloggerIdValidation(req: Request, res: Response, next: NextFunction) {
        const blogger = await this.bloggersService.getBloggerById(req.params.id);

        if (!blogger) {
            res.sendStatus(404)

            return;
        }

        next();
    }

}
