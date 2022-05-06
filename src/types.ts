export type Blogger = {
    id: number;
    name: string;
    youtubeUrl: string;
}

export type ErrorMessage = {
    message: string;
    field: string;
}

export type ErrorResponse = {
    errorsMessages: ErrorMessage[];
    resultCode: number;
}

export type Post = {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: number;
    bloggerName: string;
}

export type PostCreateFields = {
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: number;
}

export type CreatPostData = {
    title: string;
    shortDescription: string;
    content: string;
    blogger?: Blogger;
}