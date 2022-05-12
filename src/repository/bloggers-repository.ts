import { Blogger } from "../types";
import { bloggers } from "./db"

export const bloggersRepository = {
    getBloggers() {
        return bloggers;
    },

    getBloggerById(id: number) {
        return bloggers.find(b => b.id === id)
    },

    createBlogger(name: string, youtubeUrl: string) {
        const newBloggers: Blogger = {
            id: +(new Date()),
            name,
            youtubeUrl
        }

        bloggers.push(newBloggers);

        return newBloggers;
    },

    deleteBloggerById(id: number) {
        const bloggerIndex = bloggers.findIndex(b => b.id === id)

        if (bloggerIndex > -1) {
            bloggers.splice(bloggerIndex, 1)

            return true;
        }

        return false;
    },

    updateBloggerById(id: number, data: { name: string, youtubeUrl: string }) {
        const blogger = bloggers.find(b => b.id === id)

        if (!blogger) {
            return null;
        }
        
        blogger.name = data.name;
        blogger.youtubeUrl = data.youtubeUrl;

        return blogger;
    }
}