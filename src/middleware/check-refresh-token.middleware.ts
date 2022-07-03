import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../domain/auth.service";

@injectable()
export class RefreshTokenValidator {
    constructor(
        @inject(AuthService) protected authService: AuthService
    ) {}

    async validateRefreshToken(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.sendStatus(401)

            return;
        }

        const canUpdated = await this.authService.canRefreshedTokens(refreshToken)

        if (!canUpdated) {
            res.sendStatus(401)

            return;
        }

        next();
    }
}