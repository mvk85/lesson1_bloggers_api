import { Request, Response, Router } from "express";
import { authService } from "../domain/auth.service";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationConfirmationCode, validationConfirmedCode, validationConfirmedCodeByEmail, validationExistConfirmationCode, validationExistEmail, validationExistUserEmail, validationExistUserLogin, validationUserEmail, validationUserLogin, validationUserPassword } from "../middleware/input-validation.middleware";
import { checkBruteForceByIp } from "../middleware/ip-middleware";
import { jwtUtility } from "../utils";

export const authRouter = Router();

authRouter.post('/login',
    // checkBruteForceByIp,
    validationUserLogin,
    validationUserPassword,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const user = await authService.getUserByCredentials(req.body.login, req.body.password)

        if (!user) {
            res.sendStatus(401)

            return;
        }

        const token = jwtUtility.createJWT(user)

        res.send({ token })
    }
)

authRouter.post('/registration',
    // checkBruteForceByIp,
    validationUserLogin,
    validationUserPassword,
    validationUserEmail,
    validationExistUserLogin,
    validationExistUserEmail,
    checkValidationErrors,
    async (req: Request, res: Response) => {
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
)

authRouter.post('/registration-confirmation',
    // checkBruteForceByIp,
    validationConfirmationCode,
    validationConfirmedCode,
    validationExistConfirmationCode,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const confirmationCode = req.body.code;

        const isConfirmed = await authService.registrationConfirmation(confirmationCode)

        if (isConfirmed) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
)

authRouter.post('/registration-email-resending',
    // checkBruteForceByIp,
    validationUserEmail,
    validationExistEmail,
    validationConfirmedCodeByEmail,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const email = req.body.email

        const isSendedNewCode = await authService.registrationEmailResending(email)

        if (isSendedNewCode) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
)
