import { Request, Response, Router } from "express";
import { commentsService } from "../domain/comments.service";
import { checkCommentCredentialsAndExist, checkUserBearerAuth } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { validationCommentContent } from "../middleware/input-validation.middleware";

export const commentsRouter = Router()

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    const comment = await commentsService.getById(id);

    if (comment) {
        res.send(comment)
    } else {
        res.sendStatus(404)
    }
})

commentsRouter.delete('/:id', 
    checkUserBearerAuth,
    checkCommentCredentialsAndExist,
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const isDeleted = await commentsService.deleteById(id);

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
)

commentsRouter.put('/:id',
    checkUserBearerAuth,
    checkCommentCredentialsAndExist,
    validationCommentContent,
    checkValidationErrors,
    async (req: Request, res: Response) => {
        const commentId = req.params.id;
        const isUpdated = await commentsService.updateByid(
            commentId, 
            { content: req.body.content}
        )

        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
)