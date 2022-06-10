import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ErrorMessage } from "../types";

const generateErrorResponse = (errors: ErrorMessage[]) => ({
    errorsMessages: errors
})

const generateError = (field: string, message: string) => ({
    message,
    field
})

export const checkValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errorsExpressValidation = await validationResult(req);
    
    if (!errorsExpressValidation.isEmpty()) {
        const errors: ErrorMessage[] = [];
        
        errorsExpressValidation.array().forEach(e => {
            const error = generateError(e.param, e.msg)

            errors.push(error)
        })

      return res.status(400).json(generateErrorResponse(errors));
    }

    next();
}
