import { ObjectId } from "mongodb";

export type Blogger = {
    _id?: ObjectId,
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
    _id: ObjectId,
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

export type ResponseBloggers = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Blogger[];
  }