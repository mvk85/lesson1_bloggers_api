import { Request, Response, Router } from "express";
import { commentsService } from "../domain/comments.service";
import { authChecker } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { existenceChecker } from "../middleware/check-exist.middleware";
import { inputValidators } from "../middleware/input-validation.middleware";

export const commentsRouter = Router()

class CommentsController {
    async getById(req: Request, res: Response) {
        const id = req.params.id;
    
        const comment = await commentsService.getById(id);
    
        if (comment) {
            res.send(comment)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;

        const isDeleted = await commentsService.deleteById(id);

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async updateById(req: Request, res: Response) {
        const commentId = req.params.id;
        const isUpdated = await commentsService.updateById(
            commentId, 
            { content: req.body.content}
        )

        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
}

const commentsController = new CommentsController();

commentsRouter.get('/:id', commentsController.getById)

commentsRouter.delete('/:id', 
    existenceChecker.checkCommentExist,
    authChecker.checkUserBearerAuth,
    authChecker.checkCommentCredentials,
    commentsController.deleteById
)

commentsRouter.put('/:id',
    existenceChecker.checkCommentExist,
    authChecker.checkUserBearerAuth,
    authChecker.checkCommentCredentials,
    inputValidators.validationCommentContent,
    checkValidationErrors,
    commentsController.updateById
)