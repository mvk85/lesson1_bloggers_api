import { Router } from "express";
import { container } from "../composition-root";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { CommentsController } from "./CommentsController";

export const commentsRouter = Router()

const commentsController = container.get(CommentsController);

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