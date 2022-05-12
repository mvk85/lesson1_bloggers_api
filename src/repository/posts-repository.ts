import { PostCreateFields } from "../types";
import { bloggersRepository } from "./bloggers-repository";
import { posts } from "./db"

export const postsRepository = {
    getPosts() {
        return posts;
    },

    getPostById(id: number) {
        return posts.find(p => p.id === id)
    },

    createPost(fields: PostCreateFields) {
        const blogger = bloggersRepository.getBloggerById(fields.bloggerId);

        if (!blogger) return null;

        const newPosts = {
            id: +(new Date()),
            title: fields.title,
            shortDescription: fields.shortDescription,
            content: fields.content,
            bloggerId: blogger.id,
            bloggerName: blogger.name
        }

        posts.push(newPosts);

        return newPosts;
    },

    deletePostById(id: number) {
        const postIndex = posts.findIndex(p => p.id === id);

        if (postIndex > -1) {
            posts.splice(postIndex, 1)

            return true;
        }

        return false;
    },

    updatePostById(id: number, fields: PostCreateFields) {
        const blogger = bloggersRepository.getBloggerById(fields.bloggerId);

        if (!blogger) return false;
        
        const post = posts.find(p => p.id === id);

        if (!post) return false;

        post.title = fields.title;
        post.shortDescription = fields.shortDescription;
        post.content = fields.content;
        post.bloggerId = fields.bloggerId;

        return true;
    }
}