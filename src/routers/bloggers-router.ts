import { Request, Response, Router } from "express";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationBloggerYoutubeUrl, validationBloggerName } from "../middleware/input-validation.middleware";
import { bloggersRepository } from "../repository/bloggers-repository";

export const bloggersRouter = Router()

bloggersRouter.get("/", (req: Request, res: Response) => {
    const bloggers = bloggersRepository.getBloggers();

    res.send(bloggers)
})

bloggersRouter.post("/", 
    validationBloggerName,
    validationBloggerYoutubeUrl,
    checkValidationErrors,
    (req: Request, res: Response) => {
        const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)

        res.status(201).send(newBlogger)
    }
)

bloggersRouter.get("/:id", (req: Request, res: Response) => {
    const blogger = bloggersRepository.getBloggerById(Number(req.params.id));

    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.sendStatus(404)
    }
})

bloggersRouter.put("/:id", 
    validationBloggerName,
    validationBloggerYoutubeUrl,
    checkValidationErrors,
    (req: Request, res: Response) => {
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

        res.status(204).send(blogger)
    }
)

bloggersRouter.delete("/:id", (req: Request, res: Response) => {
    const isDeleted = bloggersRepository.deleteBloggerById(Number(req.params.id));
    
    if (!isDeleted) {
        res.send(404)
    } else {
        res.send(204)
    }
})