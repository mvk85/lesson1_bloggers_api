import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ErrorMessage } from "../types";

const generateErrorResponse = (errors: ErrorMessage[]) => ({
    errorsMessages: errors,
    resultCode: 1
})

const generateError = (field: string, message: string) => ({
    message,
    field
})

export const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errorsExpressValidation = validationResult(req);
    
    if (!errorsExpressValidation.isEmpty()) {
        const errors: ErrorMessage[] = [];
        const errorsObject = errorsExpressValidation.array().forEach(e => {
            const error = generateError(e.param, e.msg)

            errors.push(error)
        })

      return res.status(400).json(generateErrorResponse(errors));
    }

    next();
}
