import { Request, Response, Router } from "express";
import { bloggersRepository } from "../repository/bloggers-repository";
import { bloggers } from "../repository/db";
import { Blogger } from "../types";
import { validateBlogger } from "../utils";

export const bloggersRouter = Router()

bloggersRouter.get("/", (req: Request, res: Response) => {
    const bloggers = bloggersRepository.getBloggers();

    res.send(bloggers)
})

bloggersRouter.post("/", (req: Request, res: Response) => {
    const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)

    const errors = validateBlogger(newBlogger)

    if (errors) {
        res.status(400).send(errors)
    } else {
        bloggers.push(newBlogger);

        res.status(201).send(newBlogger)
    }    
})

bloggersRouter.get("/:id", (req: Request, res: Response) => {
    const blogger = bloggersRepository.getBloggerById(Number(req.params.id));

    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.sendStatus(404)
    }
})

bloggersRouter.put("/:id", (req: Request, res: Response) => {
    const blogger = bloggersRepository.updateBloggerById(
        Number(req.params.id),
        {
            name: req.body.name,
            youtubeUrl: req.body.youtubeUrl
        }
    )

    if (!blogger) {
        res.send(404);
        return;
    }
    
    const errors = validateBlogger(blogger)

    if (errors) {
        res.status(400).send(errors)
    } else {
        res.status(204).send(blogger)
    }
})

bloggersRouter.delete("/:id", (req: Request, res: Response) => {
    const isDeleted = bloggersRepository.deleteBloggerById(Number(req.params.id));
    
    if (!isDeleted) {
        res.send(404)
    } else {
        res.send(204)
    }
})