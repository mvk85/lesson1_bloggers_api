import { Request, Response, Router } from "express";
import { authService } from "../domain/auth.service";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { inputValidators } from "../middleware/input-validation.middleware";
import { ipChecker } from "../middleware/request-middleware";
import { jwtUtility } from "../utils";

export const authRouter = Router();

class AuthController {
    async login (req: Request, res: Response) {
        const user = await authService.getUserByCredentials(req.body.login, req.body.password)

        if (!user) {
            res.sendStatus(401)

            return;
        }

        const token = jwtUtility.createJWT(user)

        res.send({ token })
    }

    async registration (req: Request, res: Response) {
        const isRegistrated = await authService.registration({
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

        const isConfirmed = await authService.registrationConfirmation(confirmationCode)

        if (isConfirmed) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }

    async registrationEmailResending (req: Request, res: Response) {
        const email = req.body.email

        const isSendedNewCode = await authService.registrationEmailResending(email)

        if (isSendedNewCode) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
}

const authController = new AuthController();

authRouter.post('/login',
    ipChecker.checkBruteForceByIp,
    inputValidators.validationUserLogin,
    inputValidators.validationUserPassword,
    checkValidationErrors,
    authController.login
)

authRouter.post('/registration',
    ipChecker.checkBruteForceByIp,
    inputValidators.validationUserLogin,
    inputValidators.validationUserPassword,
    inputValidators.validationUserEmail,
    inputValidators.validationExistUserLogin,
    inputValidators.validationExistUserEmail,
    checkValidationErrors,
    authController.registration
)

authRouter.post('/registration-confirmation',
    ipChecker.checkBruteForceByIp,
    inputValidators.validationConfirmationCode,
    inputValidators.validationConfirmedCode,
    inputValidators.validationExistConfirmationCode,
    checkValidationErrors,
    authController.registrationConfirmation
)

authRouter.post('/registration-email-resending',
    ipChecker.checkBruteForceByIp,
    inputValidators.validationUserEmail,
    inputValidators.validationExistEmail,
    inputValidators.validationConfirmedCodeByEmail,
    checkValidationErrors,
    authController.registrationEmailResending
)
