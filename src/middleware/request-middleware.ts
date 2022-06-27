import { NextFunction, Request, Response } from "express";
import { requestsService } from "../domain/requests.service";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";

class IpChecker {
    async checkBruteForceByIp(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip;
        const endpoint = req.baseUrl + req.path;
    
        const isCorrectRequest = await requestsService.getRequestsCountWithDuration(ip, endpoint);
    
        if (!isCorrectRequest) {
            res.sendStatus(429)
    
            return;
        }
    
        const newRequestItem: BruteForceItem = new BruteForceItem(
            ip,
            endpoint,
            newDateInMilliseconds(),
        )
    
        await requestsService.saveRequest(newRequestItem)
    
        next()
    }
}

export const ipChecker = new IpChecker();

