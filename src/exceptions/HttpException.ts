export class HttpException<T = any> extends Error {
    errors: T;
    status: number;

    constructor(status: number, message: string, errors?: T) {
        super(message);
        this.status = status;
        if (errors) {
            this.errors = errors;
        }
    }
}