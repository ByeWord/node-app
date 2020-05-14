import {Schema, model, Document, Model} from "mongoose";
import {IUserDocument} from "./User";

export interface Like {
    username: IUserDocument["username"];
    createdAt: string;
}

export interface ILikeDocument extends Document {
    username: IUserDocument["username"];
    createdAt: string;
    _doc: ILikeDocument;
}

export interface IPostDocument extends Document {
    body: string;
    username: IUserDocument["username"];
    createdAt: string;
    user: IUserDocument["_id"];
    likes: Like[]
    _doc: IPostDocument
}

const likeSchema = new Schema<ILikeDocument>({
    username: {
        type: String,
        required: true
    },
    createdAt: String
})

const postSchema: Schema = new Schema<IPostDocument>({
    body: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    likes: [likeSchema]
});

const Post: Model<IPostDocument> = model<IPostDocument>("Post", postSchema, "posts");

export default Post;