import {Router, Request, NextFunction, Response} from "express";
import validator from "validator";
import isEmpty = validator.isEmpty;
import {HttpException} from "../exceptions/HttpException";
import Post, {IPostDocument} from "../models/Post";
import {UNPROCESSABLE_ENTITY, /*UNAUTHORIZED*/} from "http-status-codes";
import checkAuthMiddleware from "../middlewares/check-auth.middleware";
// import {checkBody} from "../utils/validators/users.validator";
// import {throwPostNotFoundError} from "../utils/throwable/throwError";
// import {IUserDocument} from "../models/User";

const router = Router();
/**
 * getPosts
 */
router.get("/posts", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageNumber = req.query.pageNumber as string;
        let pageSize = req.query.pageSize as string;

        const {isNumeric, isEmpty} = validator;

        if (!isNumeric(pageNumber)) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "pageNumber must be numeric", {});
        } else if (isEmpty(pageNumber.trim())) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "pageNumber must be not empty", {});
        }

        if (!isNumeric(pageSize)) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "pageSize must be numeric", {});
        } else if (isEmpty(pageSize.trim())) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "pageSize must be not empty", {});
        }
        const posts: IPostDocument[] = await Post.find()
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .exec();
        res.json({
            success: true,
            data: {
                posts
            }
        })
    } catch (e) {
        next(e)
    }
});
/**
 * createPosts
 */
router.post("/post", checkAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {body} = req.body;
        if (isEmpty(body.trim())) {
            throw new HttpException(UNPROCESSABLE_ENTITY, "", {
                body: "empty body"
            })
        }
        const {currentUser: user} = req;
        const post: IPostDocument = new Post({
            body,
            username: user!.username,
            user: user!._id,
            createdAt: new Date().toISOString()
        })
        const resPost = await post.save();
        res.json({
            success: true,
            data: {
                resPost
            }
        })
    } catch (error) {
        next(error);
    }
});

// const likePost = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const {id} = req.params;
//         const user = req.currentUser as IUserDocument;
//         const post = await Post.findById(id);
//         if (post) {
//             if (post.likes.find(like => like.username === user.username)) {
//                 post.likes = post.likes.filter(like => like.username !== user.username);
//             } else {
//                 post.likes.push({
//                     username: user.username,
//                     createdAt: new Date().toISOString()
//                 })
//             }
//             await post.save();
//             res.json({
//                 success: true,
//                 data: {
//                     post
//                 }
//             })
//         } else {
//             throwPostNotFoundError();
//         }
//     } catch (e) {
//         next(e)
//     }
// }
//
// const deletePost = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const {id} = req.params;
//
//         const post = await Post.findById(id);
//
//         const user = req.currentUser as IUserDocument;
//
//         if (post) {
//             if (post.username === user.username) {
//                 await Post.findByIdAndDelete(id);
//
//                 res.json({
//                     success: true,
//                     data: {message: "deleted successfully"}
//                 });
//             } else {
//                 throw new HttpException(UNAUTHORIZED, "Action not allowed");
//             }
//         } else {
//             throwPostNotFoundError();
//         }
//     } catch (error) {
//         next(error);
//     }
// }
//
// const updatePost = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const {id} = req.params;
//         const {body} = req.body;
//         checkBody(body);
//         const post = await Post.findById(id);
//         if (post) {
//             const user = req.currentUser as IUserDocument;
//             if (post.username === user.username) {
//                 const updatedPost = await Post.findByIdAndUpdate(id, {body}, {new: true});
//                 res.json({
//                     success: true,
//                     data: {
//                         post: updatedPost
//                     }
//                 })
//             } else {
//                 throw new HttpException(UNAUTHORIZED, "Action not allowed");
//             }
//         } else {
//             throwPostNotFoundError();
//         }
//     } catch (e) {
//         next(e);
//     }
// }

// const getPost = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const {id} = req.params;
//         const post = await Post.findById(id);
//         if (post) {
//             res.json({
//                 success: true,
//                 data: {
//                     post
//                 }
//             })
//         } else {
//             throwPostNotFoundError();
//         }
//     } catch (error) {
//         next(error);
//     }
// }

export default router;