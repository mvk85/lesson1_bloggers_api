import { requestsRepository } from "../repository/requests-repository";
import { BruteForceItem } from "../types";

export const requestsService = {
    async saveRequest(item: BruteForceItem) {
        await requestsRepository.writeRequest(item);
    },

    async checkRequestsCount(ip: string, endpoint: string) {
        const requestCount = await requestsRepository.getRequestsCountByIp(ip, endpoint);

        return requestCount <= 5;
    }
}