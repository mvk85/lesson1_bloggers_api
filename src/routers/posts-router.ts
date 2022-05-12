import { Request, Response, Router } from "express";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationPostBloggerId, validationPostContent, validationPostShortDescription, validationPostTitle } from "../middleware/input-validation.middleware";
import { postsRepository } from "../repository/posts-repository";

export const postsRouter = Router();

postsRouter.get("/", (req: Request, res: Response) => {
    const posts = postsRepository.getPosts();

    res.status(200).send(posts)
})

postsRouter.post("/", 
    validationPostTitle,
    validationPostShortDescription,
    validationPostContent,
    validationPostBloggerId,
    checkValidationErrors,
    (req: Request, res: Response) => {
        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: +req.body.bloggerId
        }

        const newPost = postsRepository.createPost(bodyFields)

        if (!newPost) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newPost)
    }
)

postsRouter.get("/:id", (req: Request, res: Response) => {
    const postId = +req.params.id;

    const post = postsRepository.getPostById(postId)

    if (!post) {
        res.sendStatus(404)
    } else {
        res.status(200).send(post);
    }
})

postsRouter.put("/:id", 
    validationPostTitle,
    validationPostShortDescription,
    validationPostContent,
    validationPostBloggerId,
    checkValidationErrors,
    (req: Request, res: Response) => {
        const postId = +req.params.id;

        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: req.body.bloggerId
        }

        const isUpdated = postsRepository.updatePostById(postId, bodyFields)

        if (!isUpdated) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204);
        }
    }
)

postsRouter.delete("/:id", (req: Request, res: Response) => {
    const postId = +req.params.id;

    const isDeleted = postsRepository.deletePostById(postId)

    if (!isDeleted) {
        res.send(404)
    } else {
        res.send(204);
    }
})