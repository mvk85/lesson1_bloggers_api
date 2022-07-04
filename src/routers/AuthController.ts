import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AuthService } from "../domain/auth.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { RefreshTokenValidator } from "../middleware/check-refresh-token.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";
import { IpChecker } from "../middleware/request-middleware";
import { IoCConstantsKey } from "../types";

@injectable()
export class AuthController {
    constructor(
        protected authService: AuthService,
        public inputValidators: InputValidators,
        public ipChecker: IpChecker,
        public refreshTokenValidator: RefreshTokenValidator,
        public authChecker: AuthChecker,
        @inject(IoCConstantsKey.isProduction) private isProduction: boolean
    ) {}

    async login(req: Request, res: Response) {
        const user = await this.authService.getUserByCredentials(req.body.login, req.body.password);

        if (!user) {
            res.sendStatus(401);

            return;
        }

        const tokens = this.authService.createTokensByUserId(user.id);
        
        this.addRefreshTokenToCookie(res, tokens.refresh)

        res.send({ accessToken: tokens.access });
    }

    private addRefreshTokenToCookie(res: Response, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, { 
            secure: this.isProduction, // true needs for https
            httpOnly: true 
        })
    }

    async registration(req: Request, res: Response) {
        const isRegistrated = await this.authService.registration({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        });

        if (isRegistrated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }

    async registrationConfirmation(req: Request, res: Response) {
        const confirmationCode = req.body.code;

        const isConfirmed = await this.authService.registrationConfirmation(confirmationCode);

        if (isConfirmed) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }

    async registrationEmailResending(req: Request, res: Response) {
        const email = req.body.email;

        const isSendedNewCode = await this.authService.registrationEmailResending(email);

        if (isSendedNewCode) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        await this.authService.addTokenToBlackList(refreshToken)

        const tokens = this.authService.createTokensByRefreshToken(refreshToken);

        console.log('---- equals refreshTokens = ', refreshToken === tokens.refresh) 

        this.addRefreshTokenToCookie(res, tokens.refresh)

        res.send({ accessToken: tokens.access });
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        await this.authService.addTokenToBlackList(refreshToken)

        res.sendStatus(204)
    }

    async me(req: Request, res: Response) {
        // const refreshToken = req.cookies.refreshToken;
        const userId = req.user?.userId

        if (!userId) {
            res.sendStatus(401)

            return;
        }

        const meData = await this.authService.me(userId)

        if (!meData) {
            res.sendStatus(400)

            return;
        }

        res.status(200).send(meData)
    }
}
