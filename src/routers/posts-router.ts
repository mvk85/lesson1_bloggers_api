import { Request, Response, Router } from "express";
import { PostsService } from "../domain/posts.service";
import { AuthChecker } from "../middleware/auth.middleware";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { ExistenceChecker } from "../middleware/check-exist.middleware";
import { InputValidators } from "../middleware/input-validation.middleware";

export const postsRouter = Router();

class PostsController {
    authChecker: AuthChecker

    postsService: PostsService

    existenceChecker: ExistenceChecker

    inputValidators: InputValidators

    constructor() {
        this.authChecker = new AuthChecker();
        this.postsService = new PostsService();
        this.existenceChecker = new ExistenceChecker();
        this.inputValidators = new InputValidators();
    }

    async getPosts(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
        const response = await this.postsService.getPosts(
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        );
    
        res.status(200).send(response)
    }

    async createPost(req: Request, res: Response) {
        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: req.body.bloggerId
        }

        const newPost = await this.postsService.createPost(bodyFields)

        if (!newPost) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newPost)
    }

    async getPostById(req: Request, res: Response) {
        const postId = req.params.id;
    
        const post = await this.postsService.getPostById(postId)
    
        if (!post) {
            res.sendStatus(404)
        } else {
            res.status(200).send(post);
        }
    }

    async updatePostById(req: Request, res: Response) {
        const postId = req.params.id;

        const bodyFields = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: req.body.bloggerId
        }

        const isUpdated = await this.postsService.updatePostById(postId, bodyFields)

        if (!isUpdated) {
            res.sendStatus(400)
        } else {
            res.sendStatus(204);
        }
    }

    async deletePostById(req: Request, res: Response) {
        const postId = req.params.id;

        const isDeleted = await this.postsService.deletePostById(postId)

        if (!isDeleted) {
            res.send(404)
        } else {
            res.send(204);
        }
    }

    async createComment(req: Request, res: Response) {
        const content = req.body.content;

        const newComment = await this.postsService.createComment({
            content,
            userId: req.user!.userId,
            userLogin: req.user!.userLogin,
            postId: req.params.id,
        })

        if (!newComment) {
            res.sendStatus(400)

            return;
        }

        res.status(201).send(newComment)
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const { PageNumber, PageSize } = req.query;
        const response = await this.postsService.getCommentsByPostId(
            req.params.id,
            { 
                PageNumber: PageNumber as string, 
                PageSize: PageSize as string 
            }
        );

        res.status(200).send(response)
    }
}

const postsController = new PostsController();

postsRouter.get("/", postsController.getPosts.bind(postsController))

postsRouter.post("/",
    postsController.authChecker.checkAdminBasicAuth.bind(postsController.authChecker),
    postsController.inputValidators.validationPostTitle.bind(postsController.inputValidators),
    postsController.inputValidators.validationPostShortDescription.bind(postsController.inputValidators),
    postsController.inputValidators.validationPostContent.bind(postsController.inputValidators),
    postsController.inputValidators.validationPostBloggerId.bind(postsController.inputValidators),
    checkValidationErrors,
    postsController.createPost.bind(postsController)
)

postsRouter.get("/:id", postsController.getPostById.bind(postsController))

postsRouter.put("/:id",
    postsController.authChecker.checkAdminBasicAuth.bind(postsController),
    postsController.existenceChecker.checkPostExist.bind(postsController.existenceChecker),
    postsController.inputValidators.validationPostTitle.bind(postsController.inputValidators),
    postsController.inputValidators.validationPostShortDescription.bind(postsController.inputValidators),
    postsController.inputValidators.validationPostContent.bind(postsController.inputValidators),
    postsController.inputValidators.validationPostBloggerId.bind(postsController.inputValidators),
    checkValidationErrors,
    postsController.updatePostById.bind(postsController)
)

postsRouter.delete("/:id", 
    postsController.authChecker.checkAdminBasicAuth.bind(postsController.authChecker),
    postsController.existenceChecker.checkPostExist.bind(postsController.existenceChecker),
    postsController.deletePostById.bind(postsController)
)

postsRouter.post('/:id/comments', 
    postsController.authChecker.checkUserBearerAuth.bind(postsController.authChecker),
    postsController.existenceChecker.checkPostExist.bind(postsController.existenceChecker),
    postsController.inputValidators.validationCommentContent.bind(postsController.inputValidators),
    checkValidationErrors,
    postsController.createComment.bind(postsController)
)

postsRouter.get('/:id/comments', 
    postsController.existenceChecker.checkPostExist.bind(postsController.existenceChecker),
    postsController.getCommentsByPostId.bind(postsController)
)