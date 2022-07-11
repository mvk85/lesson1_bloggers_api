import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BloggersService } from "../domain/bloggers.service";
import { PostsService } from "../domain/posts.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { BloggerValidator } from "../middleware/blogger-id-validation";
import { InputValidators } from "../middleware/input-validation.middleware";

@injectable()
export class BloggersController {
    constructor(
        protected bloggersService: BloggersService,
        public authChecker: AuthChecker,
        protected postsService: PostsService,
        public bloggerValidator: BloggerValidator,
        @inject(InputValidators) public inputValidators: InputValidators
    ) { }

    async getBloggers(req: Request, res: Response) {
        const {
            SearchNameTerm, PageNumber, PageSize
        } = req.query;
        const response = await this.bloggersService.getBloggers(
            { SearchNameTerm: SearchNameTerm as string },
            {
                PageNumber: PageNumber as string,
                PageSize: PageSize as string
            }
        );

        res.send(response);
    }

    async createBlogger(req: Request, res: Response) {
        const newBlogger = await this.bloggersService.createBlogger(req.body.name, req.body.youtubeUrl);

        res.status(201).send(newBlogger);
    }

    async getBloggerById(req: Request, res: Response) {
        const blogger = await this.bloggersService.getBloggerById(req.params.id);

        if (blogger) {
            res.status(200).send(blogger);
        } else {
            res.sendStatus(404);
        }
    }

    async updateBloggerById(req: Request, res: Response) {
        const isUpdated = await this.bloggersService.updateBloggerById(
            req.params.id,
            {
                name: req.body.name,
                youtubeUrl: req.body.youtubeUrl
            }
        );

        if (!isUpdated) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);
    }

    async deleteBloggerById(req: Request, res: Response) {
        const isDeleted = await this.bloggersService.deleteBloggerById(req.params.id);

        if (!isDeleted) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    }

    async getPostsByBloggerId(req: Request, res: Response) {
        const {
            PageNumber, PageSize
        } = req.query;
        const response = await this.bloggersService.getPostsByBloggerId(
            req.params.id,
            {
                PageNumber: PageNumber as string,
                PageSize: PageSize as string
            }
        );

        res.send(response);
    }

    async createPost(req: Request, res: Response) {
        const bloggerId = req.params.id;

        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId
        };

        const newPost = await this.postsService.createPost(bodyFields);

        if (!newPost) {
            res.sendStatus(400);

            return;
        }

        res.status(201).send(newPost);
    }
}
