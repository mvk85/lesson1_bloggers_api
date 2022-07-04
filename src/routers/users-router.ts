import { Router } from "express";
import { container } from "../composition-root";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { UsersController } from "./UsersController";

export const usersRouter = Router();

const usersController = container.get(UsersController);

usersRouter.get("/", usersController.getUsers.bind(usersController))

usersRouter.post("/",
    usersController.authChecker.checkAdminBasicAuth.bind(usersController.authChecker),
    usersController.inputValidators.validationUserLogin.bind(usersController.inputValidators),
    usersController.inputValidators.validationUserPassword.bind(usersController.inputValidators),
    usersController.inputValidators.validationUserEmail.bind(usersController.inputValidators),
    usersController.inputValidators.validationExistUserLogin.bind(usersController.inputValidators),
    usersController.inputValidators.validationExistUserEmail.bind(usersController.inputValidators),
    checkValidationErrors,
    usersController.createUser.bind(usersController)
)

usersRouter.delete("/:userId", 
    usersController.authChecker.checkAdminBasicAuth.bind(usersController.authChecker),
    usersController.deleteUserById.bind(usersController)
)