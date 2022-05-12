import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { bloggers, posts } from "./repository/db"
import { Blogger } from "./types"
import { createPost, getBlogger, getPost, getPostIndex, validateBlogger, validatePostField } from "./utils"
import { bloggersRouter } from "./routers/bloggers-router"
import { postsRouter } from "./routers/posts-router"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

// Bloggers
app.use('/bloggers', bloggersRouter);

// Posts
app.use('/posts', postsRouter);

app.listen(port, () => {
    console.log(`Server was starting on port: ${port}`);    
})