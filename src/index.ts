import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { bloggers } from "./mockData"
import { Blogger } from "./types"
import { validateBlogger } from "./utils"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

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

app.listen(port, () => {
    console.log(`Server was starting on port: ${port}`);    
})