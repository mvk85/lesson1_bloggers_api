import { Request, Response, Router } from "express";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationPostBloggerId, validationPostContent, validationPostShortDescription, validationPostTitle } from "../middleware/input-validation.middleware";
import { postsRepository } from "../repository/posts-repository";

export const postsRouter = Router();

postsRouter.get("/", async (req: Request, res: Response) => {
    const posts = await postsRepository.getPosts();

    res.status(200).send(posts)
})

postsRouter.post("/", 
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
            bloggerId: +req.body.bloggerId
        }

        const newPost = await postsRepository.createPost(bodyFields)

        if (!newPost) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newPost)
    }
)

postsRouter.get("/:id", async (req: Request, res: Response) => {
    const postId = +req.params.id;

    const post = await postsRepository.getPostById(postId)

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
    async (req: Request, res: Response) => {
        const postId = Number(req.params.id);
        const postForUpdate = await postsRepository.getPostById(postId);

        if (!postForUpdate) {
            res.sendStatus(404)

            return;
        }

        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: Number(req.body.bloggerId)
        }

        const isUpdated = await postsRepository.updatePostById(postId, bodyFields)

        if (!isUpdated) {
            res.sendStatus(400)
        } else {
            res.sendStatus(204);
        }
    }
)

postsRouter.delete("/:id", async (req: Request, res: Response) => {
    const postId = +req.params.id;

    const isDeleted = await postsRepository.deletePostById(postId)

    if (!isDeleted) {
        res.send(404)
    } else {
        res.send(204);
    }
})