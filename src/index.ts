import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { bloggersRouter } from "./routers/bloggers-router"
import { postsRouter } from "./routers/posts-router"
import { authMiddleware } from "./middleware/auth.middleware"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(authMiddleware)

app.use('/bloggers', bloggersRouter);

app.use('/posts', postsRouter);

app.listen(port, () => {
    console.log(`Server was starting on port: ${port}`);    
})