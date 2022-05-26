import { Request, Response, Router } from "express";
import { bloggersService } from "../domain/bloggers.service";
import { postsService } from "../domain/posts.service";
import { checkUserBearerAuth } from "../middleware/auth.middleware";
import { bloggerIdValidation } from "../middleware/blogger-id-validation";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationBloggerYoutubeUrl, validationBloggerName, validationPostTitle, validationPostShortDescription, validationPostContent } from "../middleware/input-validation.middleware";

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
    checkUserBearerAuth,
    validationBloggerName,
    validationBloggerYoutubeUrl,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)

        res.status(201).send(newBlogger)
    }
)

bloggersRouter.get("/:id", async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggerById(req.params.id);

    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.sendStatus(404)
    }
})

bloggersRouter.put("/:id", 
    checkUserBearerAuth,
    validationBloggerName,
    validationBloggerYoutubeUrl,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const isUpdated = await bloggersService.updateBloggerById(
            req.params.id,
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

bloggersRouter.delete("/:id", 
    checkUserBearerAuth,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBloggerById(req.params.id);
        
        if (!isDeleted) {
            res.send(404)
        } else {
            res.send(204)
        }
    }
)

bloggersRouter.get("/:id/posts", 
    bloggerIdValidation,
    async (req: Request, res: Response) => {
        const { 
            PageNumber, 
            PageSize 
        } = req.query;
        const response = await bloggersService.getPostsByBloggerId(
            req.params.id,
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        );

        res.send(response)
    }
)

bloggersRouter.post("/:id/posts", 
    checkUserBearerAuth,
    bloggerIdValidation,
    validationPostTitle,
    validationPostShortDescription,
    validationPostContent,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const bloggerId = req.params.id;

        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId
        }

        const newPost = await postsService.createPost(bodyFields)

        if (!newPost) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newPost)
    }
)