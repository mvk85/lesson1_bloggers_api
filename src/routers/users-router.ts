import { Request, Response, Router } from "express";
import { UsersService } from "../domain/users.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";

export const usersRouter = Router();

class UserController {
    usersService: UsersService

    authChecker: AuthChecker

    inputValidators: InputValidators

    constructor() {
        this.usersService = new UsersService();
        this.authChecker = new AuthChecker();
        this.inputValidators = new InputValidators();
    }

    async getUsers(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
    
        const responseUserObject = await this.usersService.getUsers(
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        )
    
        res.send(responseUserObject);
    }

    async createUser(req: Request, res: Response) {
        const {login, password, email} = req.body;

        const user = await this.usersService.addUser({ login, password, email })

        if (!user) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(user);
    }

    async deleteUserById(req: Request, res: Response) {
        const userId = req.params.userId;

        const isDeleted = await this.usersService.deleteUserById(userId);

        if (!isDeleted) {
            res.sendStatus(404)

            return;
        }

        res.sendStatus(204);
    }
}

const userController = new UserController();

usersRouter.get("/", userController.getUsers.bind(userController))

usersRouter.post("/",
    userController.authChecker.checkAdminBasicAuth.bind(userController.authChecker),
    userController.inputValidators.validationUserLogin.bind(userController.inputValidators),
    userController.inputValidators.validationUserPassword.bind(userController.inputValidators),
    userController.inputValidators.validationUserEmail.bind(userController.inputValidators),
    checkValidationErrors,
    userController.createUser.bind(userController)
)

usersRouter.delete("/:userId", 
    userController.authChecker.checkAdminBasicAuth.bind(userController.authChecker),
    userController.deleteUserById.bind(userController)
)