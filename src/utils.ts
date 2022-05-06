import { bloggers } from "./mockData";
import { Blogger, CreatPostData, ErrorMessage, ErrorResponse, Post, PostCreateFields } from "./types";

const generateErrorResponse = (errors: ErrorMessage[]) => ({
    errorsMessages: errors,
    resultCode: 1
})

const generateError = (field: string) => ({
    message: 'string',
    field
})

const regexUrl = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

export const validateBlogger = (blogger: Blogger): null | ErrorResponse => {
    const errors: ErrorMessage[] = []

    if (!blogger.name || !blogger.name.trim() || blogger.name.length > 15) {
        errors.push(generateError('name'));
    }

    if (
        !blogger.youtubeUrl
        || !blogger.youtubeUrl.trim() 
        || !regexUrl.test(blogger.youtubeUrl) 
        || blogger.youtubeUrl.length > 100
    ) {
        errors.push(generateError('youtubeUrl'))
    } 

    return errors.length ? generateErrorResponse(errors) : null;
}

export const validatePostField = (post: PostCreateFields, blogger?: Blogger) => {
    const errors: ErrorMessage[] = []

    if (!post.title || !post.title.trim() || post.title.length > 30) {
        errors.push(generateError('title'));
    }

    if (!post.shortDescription || !post.shortDescription.trim() || post.shortDescription.length > 100) {
        errors.push(generateError('shortDescription'));
    }

    if (!post.content || !post.content.trim() || post.content.length > 1000) {
        errors.push(generateError('content'));
    }

    if (post.bloggerId == null || !blogger) {
        errors.push(generateError('bloggerId'));
    }

    return errors.length ? generateErrorResponse(errors) : null;
}

export const createPost = (data: CreatPostData): Post | null => {
    if (!data.blogger) return null;

    return {
        id: +(new Date()),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        bloggerId: data.blogger.id,
        bloggerName: data.blogger.name
    }
}

export const getBlogger = (bloggers: Blogger[], bloggerId: number) => 
    bloggers.find(b => b.id === bloggerId);