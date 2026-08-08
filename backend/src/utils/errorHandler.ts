import type { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError.js";

export default function globalErrorHandler(
    err: Error, 
    req: Request, 
    res: Response,
    next: NextFunction
){
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors ?? [],
        })
    }

    console.log({
        message: err.message,
        stackTrace: err.stack
    });

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}