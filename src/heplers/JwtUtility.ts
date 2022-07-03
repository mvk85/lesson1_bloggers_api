import jwt, { SignOptions } from 'jsonwebtoken';
import { injectable } from "inversify"
import { settings } from "../setting"

@injectable()
export class JwtUtility {
    createJWTTokens(userId: string) {
        return {
            access: this.createJWTAccessToken(userId),
            refresh: this.createJWTRefreshToken(userId)
        }
    }
    
    createJWTAccessToken(userId: string) {
        return this.createJWTToken(userId, '10s', settings.JWT_ACCESS_SECRET)
    }
    
    createJWTRefreshToken(userId: string) {
        return this.createJWTToken(userId, '20s', settings.JWT_REFRESH_SECRET)
    }

    createJWTToken(userId: string, expired: string, jwtSecretKey: string) {
        const payload = { userId }
        const options: SignOptions = {
            expiresIn: expired,
        }

        const jwtToken = jwt.sign(payload, jwtSecretKey, options)

        return jwtToken
    }

    getUserIdByToken(token: string, isRefreshToken?: boolean) {
        try {
            const secretOrPublicKey = isRefreshToken ? settings.JWT_REFRESH_SECRET : settings.JWT_ACCESS_SECRET
            const result: any = jwt.verify(token, secretOrPublicKey)

            return result.userId;
        } catch(error) {
            return null
        }
    }

    checkRefreshToken(token: string): Boolean {
        try {
            jwt.verify(token, settings.JWT_REFRESH_SECRET)

            return true
        } catch(_) {
            return false;
        }
    }
}
