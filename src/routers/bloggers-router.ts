import { Router } from "express";
import { container } from "../composition-root";
import { checkValidationErrors } from "../middleware/check-errors.middleware";
import { BloggersController } from "./BloggersController";

export const bloggersRouter = Router()

const bloggersController = container.get(BloggersController);

bloggersRouter.get("/", bloggersController.getBloggers.bind(bloggersController))

bloggersRouter.post("/", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController.authChecker),
    bloggersController.inputValidators.validationBloggerName.bind(bloggersController.inputValidators),
    bloggersController.inputValidators.validationBloggerYoutubeUrl.bind(bloggersController.inputValidators),
    checkValidationErrors,
    bloggersController.createBlogger.bind(bloggersController)
)

bloggersRouter.get("/:id", bloggersController.getBloggerById.bind(bloggersController).bind(bloggersController))

bloggersRouter.put("/:id", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController.authChecker),
    bloggersController.inputValidators.validationBloggerName.bind(bloggersController.inputValidators),
    bloggersController.inputValidators.validationBloggerYoutubeUrl.bind(bloggersController.inputValidators),
    checkValidationErrors,
    bloggersController.updateBloggerById.bind(bloggersController)
)

bloggersRouter.delete("/:id", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController.authChecker),
    bloggersController.deleteBloggerById.bind(bloggersController)
)

bloggersRouter.get("/:id/posts", 
    bloggersController.bloggerValidator.bloggerIdValidation.bind(bloggersController.bloggerValidator),
    bloggersController.getPostsByBloggerId.bind(bloggersController)
)

bloggersRouter.post("/:id/posts", 
    bloggersController.authChecker.checkAdminBasicAuth.bind(bloggersController),
    bloggersController.bloggerValidator.bloggerIdValidation.bind(bloggersController),
    bloggersController.inputValidators.validationPostTitle.bind(bloggersController),
    bloggersController.inputValidators.validationPostShortDescription.bind(bloggersController),
    bloggersController.inputValidators.validationPostContent.bind(bloggersController),
    checkValidationErrors,
    bloggersController.createPost.bind(bloggersController)
)