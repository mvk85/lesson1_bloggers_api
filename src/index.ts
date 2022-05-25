import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { bloggersRouter } from "./routers/bloggers-router"
import { postsRouter } from "./routers/posts-router"
import { checkAdminBasicAuth } from "./middleware/auth.middleware"
import { runDb } from "./repository/db"
import { usersRouter } from "./routers/users-router"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
// app.use(authMiddleware)

app.use('/bloggers', bloggersRouter);

app.use('/posts', postsRouter);

app.use('/users', usersRouter);

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()