import { Request, Response } from "express";
import { injectable } from "inversify";
import { PostsService } from "../domain/posts.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { ExistenceChecker } from "../middleware/check-exist.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";

@injectable()
export class PostsController {
    constructor(
        public authChecker: AuthChecker,
        protected postsService: PostsService,
        public existenceChecker: ExistenceChecker,
        public inputValidators: InputValidators
    ) { }

    async getPosts(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
        const response = await this.postsService.getPosts(
            {
                PageNumber: PageNumber as string,
                PageSize: PageSize as string
            }
        );

        res.status(200).send(response);
    }

    async createPost(req: Request, res: Response) {
        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: req.body.bloggerId
        };

        const newPost = await this.postsService.createPost(bodyFields);

        if (!newPost) {
            res.sendStatus(400);

            return;
        }

        res.status(201).send(newPost);
    }

    async getPostById(req: Request, res: Response) {
        const postId = req.params.id;

        const post = await this.postsService.getPostById(postId);

        if (!post) {
            res.sendStatus(404);
        } else {
            res.status(200).send(post);
        }
    }

    async updatePostById(req: Request, res: Response) {
        const postId = req.params.id;

        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: req.body.bloggerId
        };

        const isUpdated = await this.postsService.updatePostById(postId, bodyFields);

        if (!isUpdated) {
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    }

    async deletePostById(req: Request, res: Response) {
        const postId = req.params.id;

        const isDeleted = await this.postsService.deletePostById(postId);

        if (!isDeleted) {
            res.send(404);
        } else {
            res.send(204);
        }
    }

    async createComment(req: Request, res: Response) {
        const content = req.body.content;

        const newComment = await this.postsService.createComment({
            content,
            userId: req.user!.userId,
            userLogin: req.user!.userLogin,
            postId: req.params.id,
        });

        if (!newComment) {
            res.sendStatus(400);

            return;
        }

        res.status(201).send(newComment);
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
        const response = await this.postsService.getCommentsByPostId(
            req.params.id,
            {
                PageNumber: PageNumber as string,
                PageSize: PageSize as string
            }
        );

        res.status(200).send(response);
    }
}
