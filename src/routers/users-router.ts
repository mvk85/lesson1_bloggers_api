import { Request, Response, Router } from "express";
import { usersService } from "../domain/users.service";
import { authChecker } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { inputValidators } from "../middleware/input-validation.middleware";

export const usersRouter = Router();

class UserController {
    async getUsers(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
    
        const responseUserObject = await usersService.getUsers(
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        )
    
        res.send(responseUserObject);
    }

    async createUser(req: Request, res: Response) {
        const {login, password, email} = req.body;

        const user = await usersService.addUser({ login, password, email })

        if (!user) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(user);
    }

    async deleteUserById(req: Request, res: Response) {
        const userId = req.params.userId;

        const isDeleted = await usersService.deleteUserById(userId);

        if (!isDeleted) {
            res.sendStatus(404)

            return;
        }

        res.sendStatus(204);
    }
}

const userController = new UserController();

usersRouter.get("/", userController.getUsers)

usersRouter.post("/",
    authChecker.checkAdminBasicAuth,
    inputValidators.validationUserLogin,
    inputValidators.validationUserPassword,
    inputValidators.validationUserEmail,
    checkValidationErrors,
    userController.createUser
)

usersRouter.delete("/:userId", 
    authChecker.checkAdminBasicAuth,
    userController.deleteUserById
)