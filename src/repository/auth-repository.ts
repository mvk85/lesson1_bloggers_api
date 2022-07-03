import { inject, injectable } from "inversify";
import { removeObjectIdOption } from "../const";
import { BadRefreshTokensModel } from "./models.mongoose";

@injectable()
export class AuthRepository {
    constructor(@inject(BadRefreshTokensModel) protected badRefreshTokensModel: typeof BadRefreshTokensModel) {}

    async addToBadRefreshTokens(userId: string, token: string) {
        const result = await this.badRefreshTokensModel.findOneAndUpdate(
            { userId }, 
            {$push: { tokens: token}}, 
            { upsert: true, returnDocument: 'after' }
        )

        return result
    }

    async isBadRefreshToken(token: string) {
        const result = await this.badRefreshTokensModel.find({ tokens: token })

        return !!result.length
    }

    async clearBlackListRefreshTokens() {
        await this.badRefreshTokensModel.deleteMany({})
    }
}