import { addSeconds } from "date-fns";
import { inject, injectable } from "inversify";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";
import { RequestsModel } from "./models.mongoose";

const REQUEST_CHECKING_DURING = -10;

@injectable()
export class RequestsRepository {
    constructor(
        @inject(RequestsModel) private requestsModel: typeof RequestsModel
    ){}

    async getRequestsCountWithDuration(ip: string, endpoint: string) {
        const endDate = newDateInMilliseconds()
        const startDate = addSeconds(endDate, REQUEST_CHECKING_DURING).getTime();
        const count = await this.requestsModel.countDocuments({ 
            ip,
            endpoint,
            date: {"$gte": startDate, "$lte": endDate }
        });

        return count;
    }

    async getRequestsCountByLogin(login: string, endpoint: string) {
        const count = await this.requestsModel.countDocuments({ 
            endpoint,
            login
        });

        return count;
    }

    async writeRequest(request: BruteForceItem) {
        await this.requestsModel.create(request);

        return true;
    }

    async deleteAll() {
        await this.requestsModel.deleteMany({})
    }
}
