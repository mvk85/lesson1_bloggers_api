import { Request, Response, Router } from "express";
import { bloggersService } from "../domain/bloggers.service";
import { postsService } from "../domain/posts.service";
import { authChecker } from "../middleware/auth.middleware";
import { bloggerValidator } from "../middleware/blogger-id-validation";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { inputValidators } from "../middleware/input-validation.middleware";

export const bloggersRouter = Router()

class BloggerController {
    async getBloggers(req: Request, res: Response) {
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
    }

    async createBlogger(req: Request, res: Response) {
        const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)

        res.status(201).send(newBlogger)
    }

    async getBloggerById(req: Request, res: Response) {
        const blogger = await bloggersService.getBloggerById(req.params.id);
    
        if (blogger) {
            res.status(200).send(blogger)
        } else {
            res.sendStatus(404)
        }
    }

    async updateBloggerById (req: Request, res: Response) {
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

    async deleteBloggerById(req: Request, res: Response) {
        const isDeleted = await bloggersService.deleteBloggerById(req.params.id);
        
        if (!isDeleted) {
            res.send(404)
        } else {
            res.send(204)
        }
    }

    async getPostsByBloggerId(req: Request, res: Response) {
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

    async createPost(req: Request, res: Response) {
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
}

const bloggersController = new BloggerController();

bloggersRouter.get("/", bloggersController.getBloggers)

bloggersRouter.post("/", 
    authChecker.checkAdminBasicAuth,
    inputValidators.validationBloggerName,
    inputValidators.validationBloggerYoutubeUrl,
    checkValidationErrors,
    bloggersController.createBlogger
)

bloggersRouter.get("/:id", bloggersController.getBloggerById)

bloggersRouter.put("/:id", 
    authChecker.checkAdminBasicAuth,
    inputValidators.validationBloggerName,
    inputValidators.validationBloggerYoutubeUrl,
    checkValidationErrors,
    bloggersController.updateBloggerById
)

bloggersRouter.delete("/:id", 
    authChecker.checkAdminBasicAuth,
    bloggersController.deleteBloggerById
)

bloggersRouter.get("/:id/posts", 
    bloggerValidator.bloggerIdValidation,
    bloggersController.getPostsByBloggerId
)

bloggersRouter.post("/:id/posts", 
    authChecker.checkAdminBasicAuth,
    bloggerValidator.bloggerIdValidation,
    inputValidators.validationPostTitle,
    inputValidators.validationPostShortDescription,
    inputValidators.validationPostContent,
    checkValidationErrors,
    bloggersController.createPost
)