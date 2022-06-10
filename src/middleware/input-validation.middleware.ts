import { body } from "express-validator";
import { bloggersRepository } from "../repository/bloggers-repository";
import { usersRepository } from "../repository/users-repository";

const regexUrl = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

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
        const blogger = await bloggersRepository.getBloggerById(String(value));

        if (!blogger) {
           return Promise.reject()
        } else {
            return Promise.resolve()
        }
    })
    .withMessage('blogger should exists');


// users

export const validationUserLogin = body('login')
    .trim()
    .isLength({ min: 3, max: 10})
    .withMessage('login length should be between 3 and 10')

export const validationExistUserLogin = body('login')
    .custom(async (value) => {
        const user = await usersRepository.findUserByLogin(String(value))

        return user ? Promise.reject() : Promise.resolve();
    })
    .withMessage('login should not exist')

export const validationUserPassword = body('password')
    .trim()
    .isLength({ min: 6, max: 20})
    .withMessage('password length should be between 6 and 20')

export const validationUserEmail = body('email')
    .trim()
    .matches(regexEmail)
    .withMessage('email field should be valid EMAIL')

export const validationExistUserEmail = body('email')
    .custom(async (value) => {
        const user = await usersRepository.findUserByEmail(String(value))

        return user ? Promise.reject() : Promise.resolve();
    })
    .withMessage('email should not exist')

// comments

export const validationCommentContent = body('content')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('content lenght should be between 20 and 300');

// auth

export const validationConfirmationCode = body('code')
    .trim()
    .isLength({ min: 1 })
    .withMessage('code should not be empty')

export const validationConfirmedCode = body('code')
    .custom(async (value) => {
        const user = await usersRepository.findUserByConfirmationCode(String(value))

        return user?.isConfirmed ? Promise.reject() : Promise.resolve();
    })
    .withMessage('code should not be confirmed')

export const validationExistConfirmationCode = body('code')
    .custom(async (value) => {
        const user = await usersRepository.findUserByConfirmationCode(String(value))

        return user ? Promise.resolve() : Promise.reject();
    })
    .withMessage('code should exist')

export const validationConfirmedCodeByEmail = body('email')
    .custom(async (value) => {
        const user = await usersRepository.findUserByEmail(String(value))

        return user?.isConfirmed ? Promise.reject() : Promise.resolve();
    })
    .withMessage('email should not be confirmed')

export const validationExistEmail = body('email')
    .custom(async (value) => {
        const user = await usersRepository.findUserByEmail(String(value))

        return user ? Promise.resolve() : Promise.reject();
    })
    .withMessage('email should exist')

