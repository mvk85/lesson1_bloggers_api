export type Blogger = {
    id: number,
    name: string,
    youtubeUrl: string,
}

export type ErrorMessage = {
    message: string,
    field: string
}

export type ErrorResponse = {
    errorsMessages: ErrorMessage[],
    resultCode: number
}