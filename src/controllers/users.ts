import {NextFunction, Request, Response, Router} from "express";
import {validatePostRegister, RegisterInputError} from "../utils/validators/users.validator";
import {HttpException} from "../exceptions/HttpException";
import {UNPROCESSABLE_ENTITY, OK} from "http-status-codes";
import User, {IUserDocument} from "../models/User";
import {rebuildMongooseErrorHandler} from "../utils/convertor/Convertor";

const router: Router = Router();


router.post("/users/register", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {username, password, confirmPassword, email} = req.body;
        const {valid, errors} = validatePostRegister(username, password, confirmPassword, email);
        if (!valid) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "用户校验失败", errors);
        }
        const userExits = await User.findOne({username});
        if (userExits) {
            throw new HttpException<RegisterInputError>(UNPROCESSABLE_ENTITY, "该用户已经被使用", {username: "用户名已经被使用请使用其他用户名"});
        }
        const user: IUserDocument = new User({
            username,
            password,
            email
        });
        const resUser = await user.save(rebuildMongooseErrorHandler(next));
        res.status(OK).json({
            success: true,
            data: {
                resUser
            }
        })
    } catch (error) {
        next(error);
    }
});

export default router;