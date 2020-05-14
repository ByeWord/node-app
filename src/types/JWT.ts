import {IUserDocument} from "../models/User";

export interface JWTPayload {
    id: IUserDocument["_id"];
}