import { addSeconds } from "date-fns";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";
import { RequestsModel } from "./models.mongoose";

const REQUEST_CHECKING_DURING = -10;

export class RequestsRepository {
    async getRequestsCountWithDuration(ip: string, endpoint: string) {
        const endDate = newDateInMilliseconds()
        const startDate = addSeconds(endDate, REQUEST_CHECKING_DURING).getTime();
        const count = await RequestsModel.countDocuments({ 
            ip,
            endpoint,
            date: {"$gte": startDate, "$lte": endDate }
        });

        return count;
    }

    async getRequestsCountByLogin(login: string, endpoint: string) {
        const count = await RequestsModel.countDocuments({ 
            endpoint,
            login
        });

        return count;
    }

    async writeRequest(request: BruteForceItem) {
        await RequestsModel.create(request);

        return true;
    }

    async deleteAll() {
        await RequestsModel.deleteMany({})
    }
}
