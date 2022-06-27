import { Request, Response, Router } from "express";
import { postsService } from "../domain/posts.service";
import { authChecker } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { existenceChecker } from "../middleware/check-exist.middleware";
import { inputValidators } from "../middleware/input-validation.middleware";

export const postsRouter = Router();

class PostsController {
    async getPosts(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
        const response = await postsService.getPosts(
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        );
    
        res.status(200).send(response)
    }

    async createPost(req: Request, res: Response) {
        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: req.body.bloggerId
        }

        const newPost = await postsService.createPost(bodyFields)

        if (!newPost) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newPost)
    }

    async getPostById(req: Request, res: Response) {
        const postId = req.params.id;
    
        const post = await postsService.getPostById(postId)
    
        if (!post) {
            res.sendStatus(404)
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
        }

        const isUpdated = await postsService.updatePostById(postId, bodyFields)

        if (!isUpdated) {
            res.sendStatus(400)
        } else {
            res.sendStatus(204);
        }
    }

    async deletePostById(req: Request, res: Response) {
        const postId = req.params.id;

        const isDeleted = await postsService.deletePostById(postId)

        if (!isDeleted) {
            res.send(404)
        } else {
            res.send(204);
        }
    }

    async createComment(req: Request, res: Response) {
        const content = req.body.content;

        const newComment = await postsService.createComment({
            content,
            userId: req.user!.userId,
            userLogin: req.user!.userLogin,
            postId: req.params.id,
        })

        if (!newComment) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newComment)
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
        const response = await postsService.getCommentsByPostId(
            req.params.id,
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        );

        res.status(200).send(response)
    }
}

const postsController = new PostsController();

postsRouter.get("/", postsController.getPosts)

postsRouter.post("/",
    authChecker.checkAdminBasicAuth,
    inputValidators.validationPostTitle,
    inputValidators.validationPostShortDescription,
    inputValidators.validationPostContent,
    inputValidators.validationPostBloggerId,
    checkValidationErrors,
    postsController.createPost
)

postsRouter.get("/:id", postsController.getPostById)

postsRouter.put("/:id",
    authChecker.checkAdminBasicAuth,
    existenceChecker.checkPostExist,
    inputValidators.validationPostTitle,
    inputValidators.validationPostShortDescription,
    inputValidators.validationPostContent,
    inputValidators.validationPostBloggerId,
    checkValidationErrors,
    postsController.updatePostById
)

postsRouter.delete("/:id", 
    authChecker.checkAdminBasicAuth,
    existenceChecker.checkPostExist,
    postsController.deletePostById
)

postsRouter.post('/:id/comments', 
    authChecker.checkUserBearerAuth,
    existenceChecker.checkPostExist,
    inputValidators.validationCommentContent,
    checkValidationErrors,
    postsController.createComment
)

postsRouter.get('/:id/comments', 
    existenceChecker.checkPostExist,
    postsController.getCommentsByPostId
)