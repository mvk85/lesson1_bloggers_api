import { WithId } from "mongodb";

export type Blogger = WithId<{
    id: number;
    name: string;
    youtubeUrl: string;
}>

export type ErrorMessage = {
    message: string;
    field: string;
}

export type ErrorResponse = {
    errorsMessages: ErrorMessage[];
    resultCode: number;
}

export type Post = WithId<{
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: number;
    bloggerName: string;
}>

export type User = WithId<{
    passwordHash: string
} & UserItem>

export type UserItem = WithId<{
    id:	number;
    login: string;
}>

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

export type UserCreateFields = {
    login: string;
    password: string;
}

export enum MethodsHttp {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export type FilterBloggersParams = {
    SearchNameTerm?: string;
}

export type FilterBloggers = {
    name?: { $regex: string }
}

export type PaginationParams = {
    PageNumber?: string;
    PageSize?: string;
}

export type PaginationData = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
}

export type ResponseBloggers = PaginationData & {
    items: Blogger[];
}

export type ResponsePosts = PaginationData & {
    items: Post[];
}

export type ResponsePostsByBloggerId = PaginationData & {
    items: Post[];
}

export type ResponseUsers = PaginationData & {
    items: User[];
}