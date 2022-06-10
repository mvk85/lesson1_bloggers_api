import { Request, Response, Router } from "express";
import { usersService } from "../domain/users.service";
import { checkAdminBasicAuth } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationUserEmail, validationUserLogin, validationUserPassword } from "../middleware/input-validation.middleware";

export const usersRouter = Router();

usersRouter.get("/", async (req: Request, res: Response) => {
    const { PageNumber, PageSize } = req.query;

    const responseUserObject = await usersService.getUsers(
        { 
            PageNumber: PageNumber as string, 
            PageSize: PageSize as string 
        }
    )

    res.send(responseUserObject);
})

usersRouter.post("/",
    checkAdminBasicAuth,
    validationUserLogin,
    validationUserPassword,
    validationUserEmail,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const {login, password, email} = req.body;

        const user = await usersService.addUser({ login, password, email })

        if (!user) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(user);
    }
)

usersRouter.delete("/:userId", 
    checkAdminBasicAuth,
    async (req: Request, res: Response) => {
        const userId = req.params.userId;

        const isDeleted = await usersService.deleteUserById(userId);

        if (!isDeleted) {
            res.sendStatus(404)

            return;
        }

        res.sendStatus(204);
    }
)