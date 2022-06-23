export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const removeObjectIdOption = { _id: false, __v: false }

export const commentsProjection = {...removeObjectIdOption, postId: false };

export const projectionUserItem = {...removeObjectIdOption, id: true, login: true, email: true };