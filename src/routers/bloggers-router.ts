import { Request, Response, Router } from "express";
import { BloggersService } from "../domain/bloggers.service";
import { PostsService } from "../domain/posts.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { BloggerValidator } from "../middleware/blogger-id-validation";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";

export const bloggersRouter = Router()

class BloggerController {
    bloggersService: BloggersService
    
    authChecker: AuthChecker

    postsService: PostsService

    bloggerValidator: BloggerValidator

    inputValidators: InputValidators

    constructor() {
        this.bloggersService = new BloggersService()
        this.authChecker = new AuthChecker()
        this.postsService = new PostsService()
        this.bloggerValidator = new BloggerValidator()
        this.inputValidators = new InputValidators()
    }

    async getBloggers(req: Request, res: Response) {
        const { 
            SearchNameTerm, 
            PageNumber, 
            PageSize 
        } = req.query;
        const response = await this.bloggersService.getBloggers(
            { SearchNameTerm: SearchNameTerm as string },
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        );
    
        res.send(response)
    }

    async createBlogger(req: Request, res: Response) {
        const newBlogger = await this.bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)

        res.status(201).send(newBlogger)
    }

    async getBloggerById(req: Request, res: Response) {
        const blogger = await this.bloggersService.getBloggerById(req.params.id);
    
        if (blogger) {
            res.status(200).send(blogger)
        } else {
            res.sendStatus(404)
        }
    }

    async updateBloggerById (req: Request, res: Response) {
        const isUpdated = await this.bloggersService.updateBloggerById(
            req.params.id,
            {
                name: req.body.name,
                youtubeUrl: req.body.youtubeUrl
            }
        )

        if (!isUpdated) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204)
    }

    async deleteBloggerById(req: Request, res: Response) {
        const isDeleted = await this.bloggersService.deleteBloggerById(req.params.id);
        
        if (!isDeleted) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    }

    async getPostsByBloggerId(req: Request, res: Response) {
        const { 
            PageNumber, 
            PageSize 
        } = req.query;
        const response = await this.bloggersService.getPostsByBloggerId(
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

        const newPost = await this.postsService.createPost(bodyFields)

        if (!newPost) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newPost)
    }
}

const bloggersController = new BloggerController();

bloggersRouter.get("/", bloggersController.getBloggers.bind(bloggersController))

bloggersRouter.post("/", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController.authChecker),
    bloggersController.inputValidators.validationBloggerName.bind(bloggersController.inputValidators),
    bloggersController.inputValidators.validationBloggerYoutubeUrl.bind(bloggersController.inputValidators),
    checkValidationErrors,
    bloggersController.createBlogger.bind(bloggersController)
)

bloggersRouter.get("/:id", bloggersController.getBloggerById.bind(bloggersController).bind(bloggersController))

bloggersRouter.put("/:id", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController.authChecker),
    bloggersController.inputValidators.validationBloggerName.bind(bloggersController.inputValidators),
    bloggersController.inputValidators.validationBloggerYoutubeUrl.bind(bloggersController.inputValidators),
    checkValidationErrors,
    bloggersController.updateBloggerById.bind(bloggersController)
)

bloggersRouter.delete("/:id", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController.authChecker),
    bloggersController.deleteBloggerById.bind(bloggersController)
)

bloggersRouter.get("/:id/posts", 
    bloggersController.bloggerValidator.bloggerIdValidation.bind(bloggersController.bloggerValidator),
    bloggersController.getPostsByBloggerId.bind(bloggersController)
)

bloggersRouter.post("/:id/posts", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController),
    bloggersController.bloggerValidator.bloggerIdValidation.bind(bloggersController),
    bloggersController.inputValidators.validationPostTitle.bind(bloggersController),
    bloggersController.inputValidators.validationPostShortDescription.bind(bloggersController),
    bloggersController.inputValidators.validationPostContent.bind(bloggersController),
    checkValidationErrors,
    bloggersController.createPost.bind(bloggersController)
)