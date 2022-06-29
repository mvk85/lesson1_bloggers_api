import { injectable } from "inversify";
import { RequestsRepository } from "../repository/requests-repository";
import { BruteForceItem } from "../types";

const CURRENT_REQUEST = 1;
const MAX_REQUESTS_IN_DURATION = 5;

@injectable()
export class RequestsService {
    constructor(
        protected requestsRepository: RequestsRepository
    ) {}

    async saveRequest(item: BruteForceItem) {
        await this.requestsRepository.writeRequest(item);
    }

    async getRequestsCountWithDuration(ip: string, endpoint: string) {
        const requestCount = await this.requestsRepository.getRequestsCountWithDuration(ip, endpoint);

        return requestCount <= MAX_REQUESTS_IN_DURATION - CURRENT_REQUEST;
    }
}
