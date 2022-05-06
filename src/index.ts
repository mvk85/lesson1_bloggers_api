import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { bloggers, posts } from "./mockData"
import { Blogger } from "./types"
import { createPost, getBlogger, getPost, getPostIndex, validateBlogger, validatePostField } from "./utils"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

// Bloggers

app.get("/bloggers", (req: Request, res: Response) => {
    res.send(bloggers)
})

app.post("/bloggers", (req: Request, res: Response) => {
    const newBloggers: Blogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }

    const errors = validateBlogger(newBloggers)

    if (errors) {
        res.status(400).send(errors)
    } else {
        bloggers.push(newBloggers);

        res.status(201).send(newBloggers)
    }    
})

app.get("/bloggers/:id", (req: Request, res: Response) => {
    const blogger = bloggers.find(b => b.id === Number(req.params.id))

    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.send(404)
    }
})

app.put("/bloggers/:id", (req: Request, res: Response) => {
    const blogger = bloggers.find(b => b.id === Number(req.params.id))

    if (!blogger) {
        res.send(404);
        return;
    }
    
    blogger.name = req.body.name;
    blogger.youtubeUrl = req.body.youtubeUrl;

    const errors = validateBlogger(blogger)

    if (errors) {
        res.status(400).send(errors)
    } else {
        res.status(204).send(blogger)
    }
})

app.delete("/bloggers/:id", (req: Request, res: Response) => {
    const bloggerIndex = bloggers.findIndex(b => b.id === Number(req.params.id))

    if (bloggerIndex === -1) {
        res.send(404)
    } else {
        bloggers.splice(bloggerIndex, 1)

        res.send(204)
    }
})

// Posts

app.get("/posts", (req: Request, res: Response) => {
    res.status(200).send(posts)
})

app.post("/posts", (req: Request, res: Response) => {
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

app.get("/posts/:id", (req: Request, res: Response) => {
    const postId = +req.params.id;

    const post = getPost(posts, postId)

    if (!post) {
        res.send(404)
    } else {
        res.status(200).send(post);
    }
})

app.put("/posts/:id", (req: Request, res: Response) => {
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

app.delete("/posts/:id", (req: Request, res: Response) => {
    const postId = +req.params.id;

    const postIndex = getPostIndex(posts, postId)

    if (postIndex < 0) {
        res.send(404)
    } else {
        posts.splice(postIndex, 1)

        res.send(204);
    }
})

app.listen(port, () => {
    console.log(`Server was starting on port: ${port}`);    
})