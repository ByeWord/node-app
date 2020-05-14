import express, {Express, Response, Request, NextFunction} from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {errorHandlerMiddleware} from "./middlewares/error.middleware";
import UsersRouter from "./controllers/users";

const app: Express = express();
app.use(bodyParser.json());
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
    res.send({
        success: true,
        message: "success"
    });
})

app.use(UsersRouter);


app.use((_req: Request, _res: Response, _next: NextFunction) => {
    console.log(Math.random(), "Middleware for route not found")
})
app.use(errorHandlerMiddleware)


const main = async () => {
    app.listen(8080, () => {
        console.log("Server bootstrapped and listening at port 8080");
    })
    await mongoose.connect("mongodb://localhost:27017/ts_express", {useNewUrlParser: true, useUnifiedTopology: true})
}

main().catch(() => {

});