import { Blogger, ErrorMessage, ErrorResponse } from "./types";

const generateErrorResponse = (errors: ErrorMessage[]) => ({
    errorsMessages: errors,
    resultCode: 0
})

const generateError = () => ({
    message: 'string',
    field: 'name'
})

export const validateBlogger = (blogger: Blogger): null | ErrorResponse => {
    const errors: ErrorMessage[] = []

    if (!blogger.name) {
        errors.push(generateError());
    }

    return errors.length ? generateErrorResponse(errors) : null;
}