class ApiError extends Error{
    
    constructor(
        public statusCode: number, 
        message: string,
        public errors: string[] = [],
    ){
        super(message);
        //Create a stack trace for this error object, but start collecting frames after this constructor.
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;