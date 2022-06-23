import { requestsRepository } from "../repository/requests-repository";
import { BruteForceItem } from "../types";

const CURRENT_REQUEST = 1;
const MAX_REQUESTS_IN_DURATION = 5;

export const requestsService = {
    async saveRequest(item: BruteForceItem) {
        await requestsRepository.writeRequest(item);
    },

    async getRequestsCountWithDuration(ip: string, endpoint: string) {
        const requestCount = await requestsRepository.getRequestsCountWithDuration(ip, endpoint);

        return requestCount <= MAX_REQUESTS_IN_DURATION - CURRENT_REQUEST;
    },
}