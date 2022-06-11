import { NextFunction, Request, Response } from "express";
import { requestsService } from "../domain/requests.service";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";

export const checkBruteForceByIp = async (req: Request, res: Response, next: NextFunction) => {
    const isValid = await requestsService.checkRequestsCount(req.ip);

    if (!isValid) {
        res.sendStatus(429)

        return;
    }

    const newRequestItem: BruteForceItem = {
        ip: req.ip,
        date: newDateInMilliseconds(),
        endpoint: req.baseUrl + req.path
    }

    await requestsService.saveRequest(newRequestItem)

    next()
}