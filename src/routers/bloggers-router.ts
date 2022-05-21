import { Request, Response, Router } from "express";
import { bloggersService } from "../domain/bloggers.service";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationBloggerYoutubeUrl, validationBloggerName } from "../middleware/input-validation.middleware";

export const bloggersRouter = Router()

bloggersRouter.get("/", async (req: Request, res: Response) => {
    const { 
        SearchNameTerm, 
        PageNumber, 
        PageSize 
    } = req.query;
    const response = await bloggersService.getBloggers(
        { SearchNameTerm: SearchNameTerm as string },
        { 
            PageNumber: PageNumber as string, 
            PageSize: PageSize as string 
        }
    );

    res.send(response)
})

bloggersRouter.post("/", 
    validationBloggerName,
    validationBloggerYoutubeUrl,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)

        res.status(201).send(newBlogger)
    }
)

bloggersRouter.get("/:id", async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggerById(Number(req.params.id));

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
    async (req: Request, res: Response) => {
        const isUpdated = await bloggersService.updateBloggerById(
            Number(req.params.id),
            {
                name: req.body.name,
                youtubeUrl: req.body.youtubeUrl
            }
        )

        if (!isUpdated) {
            res.send(404);
            return;
        }

        res.sendStatus(204)
    }
)

bloggersRouter.delete("/:id", async (req: Request, res: Response) => {
    const isDeleted = await bloggersService.deleteBloggerById(Number(req.params.id));
    
    if (!isDeleted) {
        res.send(404)
    } else {
        res.send(204)
    }
})