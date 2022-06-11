import { addSeconds } from "date-fns";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";
import { requestsCollection } from "./db";

const REQUEST_CHECKING_DURING = -10;

export const requestsRepository = {
    async getRequestsCountByIp(ip: string, endpoint: string) {
        const endDate = newDateInMilliseconds()
        const startDate = addSeconds(endDate, REQUEST_CHECKING_DURING).getTime();
        const count = await requestsCollection.countDocuments({ 
            ip,
            endpoint,
            date: {"$gte": startDate, "$lte": endDate }
        });

        console.log('-------- getRequestsCountByIp: [ip, endpoint, count]', [ip, endpoint, count])

        return count;
    },

    async writeRequest(request: BruteForceItem) {
        await requestsCollection.insertOne(request);

        return true;
    },

    async deleteAll() {
        await requestsCollection.deleteMany({})
    }
}