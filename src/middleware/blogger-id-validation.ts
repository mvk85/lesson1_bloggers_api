import { NextFunction, Request, Response } from "express";
import { bloggersService } from "../domain/bloggers.service";


export const bloggerIdValidation = async (req: Request, res: Response, next: NextFunction) => {
    const blogger = await bloggersService.getBloggerById(req.params.id);

    if (!blogger) {
        res.sendStatus(404)

        return;
    }

    next();
}

