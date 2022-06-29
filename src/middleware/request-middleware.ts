import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { RequestsService } from "../domain/requests.service";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";

@injectable()
export class IpChecker {
    constructor(
        protected requestsService: RequestsService
    ) {}

    async checkBruteForceByIp(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip;
        const endpoint = req.baseUrl + req.path;
    
        const isCorrectRequest = await this.requestsService.getRequestsCountWithDuration(ip, endpoint);
    
        if (!isCorrectRequest) {
            res.sendStatus(429)
    
            return;
        }
    
        const newRequestItem: BruteForceItem = new BruteForceItem(
            ip,
            endpoint,
            newDateInMilliseconds(),
        )
    
        await this.requestsService.saveRequest(newRequestItem)
    
        next()
    }
}
