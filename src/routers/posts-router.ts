import { Request, Response, Router } from "express";
import { bloggers, posts } from "../repository/db";
import { createPost, getBlogger, getPost, getPostIndex, validatePostField } from "../utils";

export const postsRouter = Router();

postsRouter.get("/", (req: Request, res: Response) => {
    res.status(200).send(posts)
})

postsRouter.post("/", (req: Request, res: Response) => {
    const bodyFields = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.body.bloggerId
    }

    const blogger = getBlogger(bloggers, +req.body.bloggerId)

    const errors = validatePostField(bodyFields, blogger);

    if (errors) {
        res.status(400).send(errors)
        
        return;
    }

    const newPost = createPost({
        blogger,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
    })

    if (!newPost) {
        res.send(400)

        return;
    }

    posts.push(newPost)
    res.status(201).send(newPost)
})

postsRouter.get("/:id", (req: Request, res: Response) => {
    const postId = +req.params.id;

    const post = getPost(posts, postId)

    if (!post) {
        res.send(404)
    } else {
        res.status(200).send(post);
    }
})

postsRouter.put("/:id", (req: Request, res: Response) => {
    const postId = +req.params.id;

    const bodyFields = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.body.bloggerId
    }

    const blogger = getBlogger(bloggers, +req.body.bloggerId)

    const errors = validatePostField(bodyFields, blogger);

    if (errors) {
        res.status(400).send(errors)
        
        return;
    }

    const post = getPost(posts, postId);

    if (!post) {
        res.send(404)
    } else {
        post.title = bodyFields.title;
        post.shortDescription = bodyFields.shortDescription;
        post.content = bodyFields.content;
        post.bloggerId = bodyFields.bloggerId;

        res.send(204);
    }
})

postsRouter.delete("/:id", (req: Request, res: Response) => {
    const postId = +req.params.id;

    const postIndex = getPostIndex(posts, postId)

    if (postIndex < 0) {
        res.send(404)
    } else {
        posts.splice(postIndex, 1)

        res.send(204);
    }
})