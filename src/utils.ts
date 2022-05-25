import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "./const";
import { PaginationParams } from "./types";

export function generatePaginationData(
    paginationParams: PaginationParams,
    countItems: number,
) {
    const pageNumber = paginationParams.PageNumber 
            ? Number(paginationParams.PageNumber) 
            : DEFAULT_PAGE_NUMBER;

    const pageSize = paginationParams.PageSize 
        ? Number(paginationParams.PageSize) 
        : DEFAULT_PAGE_SIZE;

    const skip = (pageNumber - 1) * pageSize;

    const pagesCount = Math.ceil(countItems / pageSize)

    return {
        pageNumber,
        pageSize,
        pagesCount,
        skip
    }
}

export function generateCustomId() {
    return String(+(new Date()))
}