import { Router } from "express";
import { container } from "../composition-root";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { PostsController } from "./PostsController";

export const postsRouter = Router();

const postsController = container.get(PostsController);

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