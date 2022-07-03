import { Router } from "express";
import { container } from "../composition-root";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { AuthController } from "./AuthController";

export const authRouter = Router();

const authController = container.get(AuthController)

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

authRouter.post('/refresh-token', 
    authController.refreshTokenValidator.validateRefreshToken.bind(authController.refreshTokenValidator),
    authController.refreshToken.bind(authController)
)

authRouter.post('/logout', 
    authController.refreshTokenValidator.validateRefreshToken.bind(authController.refreshTokenValidator),
    authController.logout.bind(authController)
)

authRouter.post('/me', 
    authController.authChecker.checkUserBearerAuth.bind(authController.authChecker),
    authController.me.bind(authController)
)