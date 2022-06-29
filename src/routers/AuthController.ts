import { Request, Response } from "express";
import { injectable } from "inversify";
import { AuthService } from "../domain/auth.service";
import { InputValidators } from "../middleware/input-validation.middleware";
import { IpChecker } from "../middleware/request-middleware";
import { jwtUtility } from "../utils";

@injectable()
export class AuthController {
    constructor(
        protected authService: AuthService,
        public inputValidators: InputValidators,
        public ipChecker: IpChecker
    ) { }

    async login(req: Request, res: Response) {
        const user = await this.authService.getUserByCredentials(req.body.login, req.body.password);

        if (!user) {
            res.sendStatus(401);

            return;
        }

        const token = jwtUtility.createJWT(user);

        res.send({ token });
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
}
