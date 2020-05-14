import {NextFunction, Request, Response, Router} from "express";
import {validatePostRegister, RegisterInputError, validatePostLogin} from "../utils/validators/users.validator";
import {HttpException} from "../exceptions/HttpException";
import {UNPROCESSABLE_ENTITY, OK, NOT_FOUND} from "http-status-codes";
import User, {IUserDocument} from "../models/User";
import {rebuildMongooseErrorHandler} from "../utils/convertor/Convertor";
import bcrypt from "bcrypt";


const router: Router = Router();

router.post("/users/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {username, password} = req.body;
        const {valid, errors} = validatePostLogin(username, password);
        if (!valid) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "校验不通过", errors);
        }
        const user = await User.findOne({username});
        if (!user) {
            throw new HttpException(NOT_FOUND, "用户不存在");
        }
        const match = await bcrypt.compare(password, user!.password);
        if (!match) {
            errors.general = "密码错误"
            throw new HttpException(UNPROCESSABLE_ENTITY, "校验不通过", errors);
        }
        const token = user.generateToken();
        res.json({
            success: true,
            data: {
                token
            }
        })
    } catch (e) {
        next(e);
    }
})

router.post("/users/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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