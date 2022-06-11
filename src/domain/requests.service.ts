import { requestsRepository } from "../repository/requests-repository";
import { BruteForceItem } from "../types";

export const requestsService = {
    async saveRequest(item: BruteForceItem) {
        await requestsRepository.writeRequest(item);
    },

    async checkRequestsCount(ip: string) {
        const requestCount = await requestsRepository.getRequestsCountByIp(ip);

        return requestCount <= 5;
    }
}