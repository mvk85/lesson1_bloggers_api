import { Request, Response, Router } from "express";
import { postsService } from "../domain/posts.service";
import { checkAdminBasicAuth, checkUserBearerAuth } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { checkPostExist } from "../middleware/check-exist.middleware";
import { validationCommentContent, validationPostBloggerId, validationPostContent, validationPostShortDescription, validationPostTitle } from "../middleware/input-validation.middleware";

export const postsRouter = Router();

postsRouter.get("/", async (req: Request, res: Response) => {
    const { PageNumber, PageSize } = req.query;
    const response = await postsService.getPosts(
        { 
            PageNumber: PageNumber as string, 
            PageSize: PageSize as string 
        }
    );

    res.status(200).send(response)
})

postsRouter.post("/",
    checkAdminBasicAuth,
    validationPostTitle,
    validationPostShortDescription,
    validationPostContent,
    validationPostBloggerId,
    checkValidationErrors,
    async (req: Request, res: Response) => {
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
)

postsRouter.get("/:id", async (req: Request, res: Response) => {
    const postId = req.params.id;

    const post = await postsService.getPostById(postId)

    if (!post) {
        res.sendStatus(404)
    } else {
        res.status(200).send(post);
    }
})

postsRouter.put("/:id",
    checkAdminBasicAuth,
    checkPostExist,
    validationPostTitle,
    validationPostShortDescription,
    validationPostContent,
    validationPostBloggerId,
    checkValidationErrors,
    async (req: Request, res: Response) => {
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
)

postsRouter.delete("/:id", 
    checkAdminBasicAuth,
    checkPostExist,
    async (req: Request, res: Response) => {
        const postId = req.params.id;

        const isDeleted = await postsService.deletePostById(postId)

        if (!isDeleted) {
            res.send(404)
        } else {
            res.send(204);
        }
    }
)

postsRouter.post('/:id/comments', 
    checkUserBearerAuth,
    checkPostExist,
    validationCommentContent,
    checkValidationErrors,
    async (req: Request, res: Response) => {
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
)

postsRouter.get('/:id/comments', 
    checkPostExist,
    async (req: Request, res: Response) => {
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
)