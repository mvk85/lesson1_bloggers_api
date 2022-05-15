import { NextFunction, Request, Response } from "express";
import { MethodsHttp } from "../types";

const logopass = 'admin:qwerty';
const logopassBase64 = Buffer.from(logopass).toString('base64')

const authMethods = {
    [MethodsHttp.POST]: true,
    [MethodsHttp.PUT]: true,
    [MethodsHttp.DELETE]: true,
    [MethodsHttp.GET]: false
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;
    const authHeaderString = headers.authorization;
    const [authType, authHeader] = authHeaderString?.split(' ') || [];
    const isNeedAuth = authMethods[req.method as MethodsHttp]

    if (!isNeedAuth) {
        next()
    } else if (isNeedAuth && authHeader === logopassBase64 && authType === 'Basic') {
        next();
    } else {
        res.sendStatus(401)
    }
}