import { Request, Response, Router } from "express";
import { CommentsService } from "../domain/comments.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { ExistenceChecker } from "../middleware/check-exist.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";

export const commentsRouter = Router()

class CommentsController {
    authChecker: AuthChecker

    commentsService: CommentsService

    existenceChecker: ExistenceChecker

    inputValidators: InputValidators

    constructor() {
        this.authChecker = new AuthChecker()
        this.commentsService = new CommentsService()
        this.existenceChecker = new ExistenceChecker();
        this.inputValidators = new InputValidators();
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
    
        const comment = await this.commentsService.getById(id);
    
        if (comment) {
            res.send(comment)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;

        const isDeleted = await this.commentsService.deleteById(id);

        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async updateById(req: Request, res: Response) {
        const commentId = req.params.id;
        const isUpdated = await this.commentsService.updateById(
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

commentsRouter.get('/:id', commentsController.getById.bind(commentsController))

commentsRouter.delete('/:id', 
    commentsController.existenceChecker.checkCommentExist.bind(commentsController.existenceChecker),
    commentsController.authChecker.checkUserBearerAuth.bind(commentsController.authChecker),
    commentsController.authChecker.checkCommentCredentials.bind(commentsController.authChecker),
    commentsController.deleteById.bind(commentsController)
)

commentsRouter.put('/:id',
    commentsController.existenceChecker.checkCommentExist.bind(commentsController.existenceChecker),
    commentsController.authChecker.checkUserBearerAuth.bind(commentsController.authChecker),
    commentsController.authChecker.checkCommentCredentials.bind(commentsController.authChecker),
    commentsController.inputValidators.validationCommentContent.bind(commentsController.inputValidators),
    checkValidationErrors,
    commentsController.updateById.bind(commentsController)
)