import { body } from "express-validator";
import { bloggersRepository } from "../repository/bloggers-repository";

const regexUrl = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

export const validationBloggerName = body('name')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('name lenght should be between 1 and 15');

export const validationBloggerYoutubeUrl = body('youtubeUrl')
    .trim()
    .isLength({ max: 100 })
    .withMessage('youtubeUrl lenght should be less than 100')
    .matches(regexUrl)
    .withMessage('youtubeUrl should be valid URL')

export const validationPostTitle = body('title')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('title lenght should be between 1 and 30');

export const validationPostShortDescription = body('shortDescription')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('shortDescription lenght should be between 1 and 100');

export const validationPostContent = body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('content lenght should be between 1 and 1000');

export const validationPostBloggerId = body('bloggerId')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('bloggerId lenght should be between 1 and 100')
    .custom(async (value) => {
        const blogger = await bloggersRepository.getBloggerById(Number(value));

        if (!blogger) {
           return Promise.reject()
        } else {
            return Promise.resolve()
        }
    })
    .withMessage('blogger should exists');