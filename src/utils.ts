import { Blogger, ErrorMessage, ErrorResponse } from "./types";

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

    if (!blogger.name || blogger.name && blogger.name.length > 15) {
        errors.push(generateError('name'));
    }

    if (
        !blogger.youtubeUrl 
        || !regexUrl.test(blogger.youtubeUrl) 
        || blogger.youtubeUrl.length > 100
    ) {
        errors.push(generateError('youtubeUrl'))
    } 

    return errors.length ? generateErrorResponse(errors) : null;
}