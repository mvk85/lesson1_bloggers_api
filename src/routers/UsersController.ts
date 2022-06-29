import { Request, Response } from "express";
import { injectable } from "inversify";
import { UsersService } from "../domain/users.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";


@injectable()
export class UsersController {
    constructor(
        protected usersService: UsersService,
        public authChecker: AuthChecker,
        public inputValidators: InputValidators
    ) { }

    async getUsers(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;

        const responseUserObject = await this.usersService.getUsers(
            {
                PageNumber: PageNumber as string,
                PageSize: PageSize as string
            }
        );

        res.send(responseUserObject);
    }

    async createUser(req: Request, res: Response) {
        const { login, password, email } = req.body;

        const user = await this.usersService.addUser({ login, password, email });

        if (!user) {
            res.sendStatus(400);

            return;
        }

        res.status(201).send(user);
    }

    async deleteUserById(req: Request, res: Response) {
        const userId = req.params.userId;

        const isDeleted = await this.usersService.deleteUserById(userId);

        if (!isDeleted) {
            res.sendStatus(404);

            return;
        }

        res.sendStatus(204);
    }
}
