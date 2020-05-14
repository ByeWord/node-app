import {RequestWithUser} from "../types/RequestWithUser";
import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {JWTPayload} from "../types/JWT";
import {HttpException} from "../exceptions/HttpException";
import {UNAUTHORIZED} from "http-status-codes";
import User from "../models/User";

const checkAuthMiddleware = async (
    req: RequestWithUser,
    _res: Response,
    next: NextFunction
) => {
    const authentication = req.headers["authorization"];
    if (authentication) {
        const token = authentication.split("Bearer ")[0];
        if (token) {
            try {
                const jwtData = jwt.verify(token, process.env.SECRET_TOKEN_KEY!) as JWTPayload;
                const user = await User.findById(jwtData.id);
                if (!user) {
                    throw new HttpException(UNAUTHORIZED, "User did not exits", {});
                }
                req.currentUser = user!;
                next();
            } catch (e) {
                next(new HttpException(UNAUTHORIZED, "Invalid Token", {}));
            }
        }
    }
}

export default checkAuthMiddleware;