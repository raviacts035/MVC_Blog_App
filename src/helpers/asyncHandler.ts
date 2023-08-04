import express from 'express';

const asyncHandler=(fn:Function)=>async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
        await fn(req,res,next)
    }
    catch(error:({code:number,messsage:string}| any)){
        res.status(error.code).json({
            success:false,
            message :error.message
        })
    }
}

export default asyncHandler;