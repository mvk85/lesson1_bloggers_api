import { NextFunction, Request, Response } from "express";
import { jwtUtility } from "../utils";

const logopass = 'admin:qwerty';
const logopassBase64 = Buffer.from(logopass).toString('base64')

export const checkAdminBasicAuth = (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;
    const authHeaderString = headers.authorization;
    const [authType, authHeader] = authHeaderString?.split(' ') || [];
    
    if (authHeader === logopassBase64 && authType === 'Basic') {
        next();
    } else {
        res.sendStatus(401)
    }
}

export const checkUserBearerAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)

        return;
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtUtility.getUserIdByToken(token);

    if (userId) {
        next()
    } else {
        res.sendStatus(401)

        return;
    }
}