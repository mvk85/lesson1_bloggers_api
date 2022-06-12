import { WithId } from "mongodb";

type CustomIdType = string;

export type Blogger = WithId<{
    id: CustomIdType;
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
    id: CustomIdType;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
    bloggerName: string;
}>

export type User = WithId<{
    passwordHash: string;
    isConfirmed: boolean;
    confirmCode?: string | null;
} & UserItem>

export type UserItem = WithId<{
    id:	CustomIdType;
    login: string;
    email: string;
}>

export type CreatedUserType = {
    id:	CustomIdType;
    login: string;
    email: string;
}

export type Comment = WithId<{
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    addedAt: string;
    postId: string;
}>

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

export type EmailEntity = {
    email: string;
    status: EmailStatus;
    body: string;
    createdAt: string;
}

export type BruteForceItem = {
    ip: string;
    date: number;
    endpoint: string;
    // login?: string;
}