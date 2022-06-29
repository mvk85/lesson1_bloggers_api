import { Request, Response } from "express";
import { injectable } from "inversify";
import { CommentsService } from "../domain/comments.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { ExistenceChecker } from "../middleware/check-exist.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";

@injectable()
export class CommentsController {
    constructor(
        public authChecker: AuthChecker,
        protected commentsService: CommentsService,
        public existenceChecker: ExistenceChecker,
        public inputValidators: InputValidators
    ) { }

    async getById(req: Request, res: Response) {
        const id = req.params.id;

        const comment = await this.commentsService.getById(id);

        if (comment) {
            res.send(comment);
        } else {
            res.sendStatus(404);
        }
    }

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;

        const isDeleted = await this.commentsService.deleteById(id);

        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }

    async updateById(req: Request, res: Response) {
        const commentId = req.params.id;
        const isUpdated = await this.commentsService.updateById(
            commentId,
            { content: req.body.content }
        );

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }
}
