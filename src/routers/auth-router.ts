import { Request, Response, Router } from "express";
import { AuthService } from "../domain/auth.service";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";
import { IpChecker } from "../middleware/request-middleware";
import { jwtUtility } from "../utils";

export const authRouter = Router();

class AuthController {
    authService: AuthService

    inputValidators: InputValidators

    ipChecker: IpChecker

    constructor() {
        this.authService = new AuthService();
        this.inputValidators = new InputValidators();
        this.ipChecker = new IpChecker();
    }

    async login (req: Request, res: Response) {
        const user = await this.authService.getUserByCredentials(req.body.login, req.body.password)

        if (!user) {
            res.sendStatus(401)

            return;
        }

        const token = jwtUtility.createJWT(user)

        res.send({ token })
    }

    async registration (req: Request, res: Response) {
        const isRegistrated = await this.authService.registration({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        })

        if (isRegistrated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }

    async registrationConfirmation (req: Request, res: Response) {
        const confirmationCode = req.body.code;

        const isConfirmed = await this.authService.registrationConfirmation(confirmationCode)

        if (isConfirmed) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }

    async registrationEmailResending (req: Request, res: Response) {
        const email = req.body.email

        const isSendedNewCode = await this.authService.registrationEmailResending(email)

        if (isSendedNewCode) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
}

const authController = new AuthController();

authRouter.post('/login',
    authController.ipChecker.checkBruteForceByIp.bind(authController.ipChecker),
    authController.inputValidators.validationUserLogin.bind(authController.inputValidators),
    authController.inputValidators.validationUserPassword.bind(authController.inputValidators),
    checkValidationErrors,
    authController.login.bind(authController)
)

authRouter.post('/registration',
    authController.ipChecker.checkBruteForceByIp.bind(authController.ipChecker),
    authController.inputValidators.validationUserLogin.bind(authController.inputValidators),
    authController.inputValidators.validationUserPassword.bind(authController.inputValidators),
    authController.inputValidators.validationUserEmail.bind(authController.inputValidators),
    authController.inputValidators.validationExistUserLogin.bind(authController.inputValidators),
    authController.inputValidators.validationExistUserEmail.bind(authController.inputValidators),
    checkValidationErrors,
    authController.registration.bind(authController)
)

authRouter.post('/registration-confirmation',
    authController.ipChecker.checkBruteForceByIp.bind(authController.ipChecker),
    authController.inputValidators.validationConfirmationCode.bind(authController.inputValidators),
    authController.inputValidators.validationConfirmedCode.bind(authController.inputValidators),
    authController.inputValidators.validationExistConfirmationCode.bind(authController.inputValidators),
    checkValidationErrors,
    authController.registrationConfirmation.bind(authController)
)

authRouter.post('/registration-email-resending',
    authController.ipChecker.checkBruteForceByIp.bind(authController.ipChecker),
    authController.inputValidators.validationUserEmail.bind(authController.inputValidators),
    authController.inputValidators.validationExistEmail.bind(authController.inputValidators),
    authController.inputValidators.validationConfirmedCodeByEmail.bind(authController.inputValidators),
    checkValidationErrors,
    authController.registrationEmailResending.bind(authController)
)
