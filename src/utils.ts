import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "./const";
import { settings } from "./setting";
import { PaginationParams, User } from "./types";

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

export const jwtUtility = {
    /**
     * @param user
     * @return Returns JWT-token
     */
    createJWT(user: User) {
        const payload = { userId: user.id }
        const secretOrPrivateKey = settings.JWT_SECRET;
        const options: SignOptions = {
            expiresIn: '10d',
        }

        const jwtToken = jwt.sign(payload, secretOrPrivateKey, options)

        return jwtToken
    },

    /**
     * @param token jwt
     * @return userId or null
     */
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            return result.userId;
        } catch(error) {
            return null
        }
    }
}

export const generateConfirmCode = () => uuidv4()