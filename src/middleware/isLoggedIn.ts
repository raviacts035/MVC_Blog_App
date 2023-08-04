import User from '../models/userSchema';
import CustomRequest from '../types/CustomRequest';
import JWT, {JwtPayload} from 'jsonwebtoken';
import asyncHandler from "../helpers/asyncHandler";
import {Response, NextFunction} from 'express';
import CustomError from "../helpers/CustomError";
import config from "../config";


interface jwt_token extends JwtPayload{
    _id:string,
    iat:number,
    exp:number
}

export const isLoggedIn=asyncHandler(async (req:CustomRequest,_res:Response,next:NextFunction)=>{
    var token:string='';

    if (req.headers?.authorization && req.headers?.authorization?.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1]
    }

    
    if (!token){
        throw new CustomError("User not authenticated",401);
    }
    
    // const {exp}=JWT.decode()
    // if (Date.now() >= exp * 1000) {
        //     throw new CustomError("Token expired",401);
        //   }
        
    const {_id:userId}=JWT.verify(token,config.JWT_secret!) as jwt_token;

    if (!userId) throw new CustomError("User not authenticated",401);
        
    req.user=await User.findById(userId as string);

    if (!req.user) throw new CustomError("User not authenticated",401);
    next();
})