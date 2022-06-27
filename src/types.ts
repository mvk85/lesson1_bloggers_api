import { ObjectId, WithId } from "mongodb";

export type IdType = string;

export class Blogger {
    constructor(
        public _id: ObjectId,
        public id: IdType,
        public name: string,
        public youtubeUrl: string,
    ) {}
}

export type ErrorMessage = {
    message: string;
    field: string;
}

export type ErrorResponse = {
    errorsMessages: ErrorMessage[];
    resultCode: number;
}

export class Post {
    constructor(
        _id: ObjectId,
        public id: IdType,
        public title: string,
        public shortDescription: string,
        public content: string,
        public bloggerId: string,
        public bloggerName: string,
    ) {}   
}

export class User {
    constructor(
        public _id: ObjectId,
        public id:	IdType,
        public login: string,
        public passwordHash: string,
        public email: string,
        public isConfirmed: boolean,
        public confirmCode?: string | null,
    ){}
}

export type CreatedUserType = {
    id:	IdType;
    login: string;
    email: string;
}

export class Comment {
    constructor(
        public _id: ObjectId,
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public addedAt: string,
        public postId: string,
    ) {}   
}

export type ResponseCommentType = Omit<Comment, 'postId'>

export type PostCreateFields = {
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
}

export type CreatPostData = {
    title: string;
    shortDescription: string;
    content: string;
    blogger?: Blogger;
}

export type CreateUserFields = {
    login: string;
    password: string;
    email: string;
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

export type FilterComments = {
    postId?: string
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

export type ResponseCommentsByPostId = PaginationData & {
    items: ResponseCommentType[];
}

export type ResponsePostsByBloggerId = PaginationData & {
    items: Post[];
}

export type ResponseUsers = PaginationData & {
    items: User[];
}

export enum EmailStatus {
    registration = 'registration'
}

export class BruteForceItem {
    constructor(
        public ip: string,
        public endpoint: string,
        public date: number,
    ) {}
}