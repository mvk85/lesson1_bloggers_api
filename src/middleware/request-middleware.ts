import { NextFunction, Request, Response } from "express";
import { requestsService } from "../domain/requests.service";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";

const  LOGIN_ROUTER = '/auth/login';

export const checkBruteForceByLogin = async (req: Request, res: Response, next: NextFunction) => {
    const endpoint = req.baseUrl + req.path;

    if (endpoint === LOGIN_ROUTER) {
        const login = req.body.login
        const isCorrectLoginRequest = await requestsService.checkRequestsCountByLogin(login, endpoint);

        if (!isCorrectLoginRequest) {
            res.sendStatus(429)
    
            return;
        }
    }

    next()
}

export const checkBruteForceByIp = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const endpoint = req.baseUrl + req.path;

    const isCorrectRequest = await requestsService.getRequestsCountWithDuration(ip, endpoint);

    if (!isCorrectRequest) {
        res.sendStatus(429)

        return;
    }

    const login = req.body?.login
    const newRequestItem: BruteForceItem = {
        ip,
        endpoint,
        date: newDateInMilliseconds(),
        login
    }

    await requestsService.saveRequest(newRequestItem)

    next()
}