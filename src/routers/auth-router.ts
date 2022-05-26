import { Request, Response, Router } from "express";
import { authService } from "../domain/auth.service";
import { validationUserLogin, validationUserPassword } from "../middleware/input-validation.middleware";
import { jwtUtility } from "../utils";

export const authRouter = Router();

authRouter.post('/login', 
    validationUserLogin,
    validationUserPassword,
    async (req: Request, res: Response) => {
        const user = await authService.getUserByCredentials(req.body.login, req.body.password)

        if (user) {
            const token = jwtUtility.createJWT(user)

            res.send({ token })

            return;
        }

        res.sendStatus(401)
    }
)