import { requestsRepository } from "../repository/requests-repository";
import { BruteForceItem } from "../types";

export const requestsService = {
    async saveRequest(item: BruteForceItem) {
        await requestsRepository.writeRequest(item);
    },

    async getRequestsCountWithDuration(ip: string, endpoint: string) {
        const requestCount = await requestsRepository.getRequestsCountWithDuration(ip, endpoint);

        return requestCount <= 5 - 1;
    },

    async checkRequestsCountByLogin(login: string, endpoint: string) {
        const requestCount = await requestsRepository.getRequestsCountByLogin(login, endpoint);

        return requestCount <= 5;
    }
}