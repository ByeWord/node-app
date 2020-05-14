import {model, Model, Schema, Document, DocumentQuery} from "mongoose";

export interface IAddress {
    city?: string;
    street?: string;
}

export interface IAddressDocument extends Document {
    city?: string;
    street?: string;
    _doc: IAddressDocument;
}

const addressSchema = new Schema<IAddressDocument>({
    city: String,
    street: String
})


interface IBasicDocument extends Document {
    createdAt: string;
    updatedAt: string;
}

export interface IUserDocument extends IBasicDocument {
    username: string;
    password: string;
    email: string;
    addresses: IAddress[];
    _doc: IUserDocument;
    generateToken: () => string;
}

interface IUserModel extends Model<IUserDocument, {}> {

}

const userSchema: Schema = new Schema<IUserDocument>({
    username: {
        type: String,
        required: [true, "Username is required."]
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    },
    addresses: [addressSchema],
}, {
    timestamps: true
});

userSchema.static("admin", function (): DocumentQuery<IUserDocument | null, IUserDocument> {
    return User.findOne({username: "Hero"})
})

const User: Model<IUserDocument> = model<IUserDocument, IUserModel>("User", userSchema, "users");

export default User;

