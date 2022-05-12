import { Blogger, Post } from "../types";

export const bloggers: Blogger[] = [
    {
        id: 0,
        name: "Ivan",
        youtubeUrl: "youtube.com/ivan"
    }
]

export const posts: Post[] = [
    {
        id: 0,
        title: 'title',
        shortDescription: 'description',
        content: 'content 123',
        bloggerId: 0,
        bloggerName: 'Ivan'
    }
]