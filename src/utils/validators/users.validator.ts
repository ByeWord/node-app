import validator from "validator";
import isEmpty = validator.isEmpty;
import {HttpException} from "../../exceptions/HttpException";
import {UNPROCESSABLE_ENTITY} from "http-status-codes";

export interface LoginInputError {
    username?: string;
    password?: string;
    email?: string;
}

export function validatePostLogin(
    
) {

}

export interface RegisterInputError {
    username?: string;
    password?: string;
    email?: string;
    confirmPassword?: string;
}

export function validatePostRegister(
    username: string,
    password: string,
    confirmPassword: string,
    email: string
): { valid: boolean, errors: RegisterInputError } {
    const errors: RegisterInputError = {};
    const {isEmpty, isEmail, equals} = validator;
    if (username === undefined) {
        errors.username = "用户名不能缺失";
    } else if (isEmpty(username.trim())) {
        errors.username = "用户名不能为空";
    }
    if (password === undefined) {
        errors.password = "密码不能缺失";
    } else if (isEmpty(password.trim())) {
        errors.password = "密码不能为空";
    }
    if (confirmPassword === undefined) {
        errors.confirmPassword = "确认密码不能缺失";
    } else if (!equals(password, confirmPassword)) {
        errors.confirmPassword = "密码不一致";
    }
    if (email === undefined) {
        errors.email = "邮箱不能缺失";
    } else if (!isEmail(email.trim())) {
        errors.email = "邮箱格式不正确";
    } else if (isEmpty(email.trim())) {
        errors.email = "邮箱不能为空";
    }
    return {valid: Object.keys(errors).length === 0, errors};
}


export function checkBody(body: string) {
    if (isEmpty(body.trim())) {
        throw new HttpException(UNPROCESSABLE_ENTITY, "Body must be not empty", {
            body: "The body must be not empty"
        });
    }
}