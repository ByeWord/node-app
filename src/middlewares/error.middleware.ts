import {Request, Response, NextFunction} from "express";
import {HttpException} from "../exceptions/HttpException";
import {INTERNAL_SERVER_ERROR} from "http-status-codes";

export function errorHandlerMiddleware(error: HttpException, _req: Request, res: Response, _next: NextFunction) {
    const message = error.message || "Something went wrong";
    const status = error.status || INTERNAL_SERVER_ERROR;
    const errors = error.errors || {};
    res.status(status).json({
        success: false,
        message,
        errors,
    });
}

