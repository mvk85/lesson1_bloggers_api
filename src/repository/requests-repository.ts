import { addSeconds } from "date-fns";
import { BruteForceItem } from "../types";
import { newDateInMilliseconds } from "../utils";
import { requestsCollection } from "./db";

const REQUEST_CHECKING_DURING = -10;

export const requestsRepository = {
    async getRequestsCountWithDuration(ip: string, endpoint: string) {
        const endDate = newDateInMilliseconds()
        const startDate = addSeconds(endDate, REQUEST_CHECKING_DURING).getTime();
        const count = await requestsCollection.countDocuments({ 
            ip,
            endpoint,
            date: {"$gte": startDate, "$lte": endDate }
        });

        console.log('-------- getRequestsCountWithDuration: [ip, endpoint, count, startDate, endDate]', [ip, endpoint, count, startDate, endDate])

        return count;
    },

    async getRequestsCountByLogin(login: string, endpoint: string) {
        const count = await requestsCollection.countDocuments({ 
            endpoint,
            login
        });

        console.log('-------- getRequestsCountByLogin: [login, endpoint, count]', [login, endpoint, count])

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