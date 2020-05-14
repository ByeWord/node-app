import {NextFunction} from "express";
import {HttpException} from "../../exceptions/HttpException";
import {UNPROCESSABLE_ENTITY} from "http-status-codes";

export function rebuildMongooseErrorHandler(next: NextFunction) {
    return function errorHandler(error: any) {
        const rebuildErrors: any = {};
        const {errors} = error;
        Object.keys(errors).forEach(key => {
            rebuildErrors[key] = errors[key].message;
        });
        next(new HttpException(UNPROCESSABLE_ENTITY, "Process Failed", rebuildErrors));
    }
}