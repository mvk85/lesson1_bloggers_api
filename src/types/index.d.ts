import { User } from "../types";

declare global {
    declare namespace Express {
        export interface Request {
            user: { userId: string, userLogin: string } | null
        }
    }
}
