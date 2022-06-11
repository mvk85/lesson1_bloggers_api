import { NextFunction, Request, Response } from "express";
import { requestsService } from "../domain/requests.service";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";

export const checkBruteForceByIp = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const endpoint = req.baseUrl + req.path;

    const isCorrectRequest = await requestsService.checkRequestsCount(ip, endpoint);

    if (!isCorrectRequest) {
        res.sendStatus(429)

        return;
    }

    const newRequestItem: BruteForceItem = {
        ip,
        endpoint,
        date: newDateInMilliseconds()
    }

    await requestsService.saveRequest(newRequestItem)

    next()
}