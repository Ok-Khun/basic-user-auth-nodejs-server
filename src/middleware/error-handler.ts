import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export function errorHandler(err : Error, req: Request, res: Response, next: NextFunction) {
     if(err instanceof CustomError) {
        res.status(err.statusCode).send(err.serializeErrors());
    } else {
        res.status(404).send("Something went wrong!");
    }
}