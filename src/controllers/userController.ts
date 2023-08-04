import User from '../models/userSchema';
import asyncHandler from '../helpers/asyncHandler';
import express from 'express';
import CustomError from '../helpers/CustomError';


type UserStruct={
    name?:string,
    email?:string,
    password?:string
}

type loginParams={
    email?:string,
    password?:string
}

// custom Object Type
interface LooseObject {
    [key: string]: any
}

export const RegistreUser=asyncHandler(async (req:express.Request,res:express.Response)=>{
    const newUser:UserStruct=req.body;

    if (!newUser.email || !newUser.name || !newUser.password) throw new CustomError("Enter All required fields",400);

    else if (newUser.name.length > 40 || newUser.email.length > 130 || newUser.password.length > 16) throw new CustomError("Input string parameter is too long",413);
    
    const userExists:(LooseObject|null)=await User.findOne({email:newUser.email});

    if (userExists) throw new CustomError("User already exist with email", 409);

    const userCreated=await User.create(newUser);

    if (!userCreated) throw new CustomError("Unable to place new entry", 408);

    res.status(200).json({
        success: true,
        name : userCreated.name,
        email: userCreated.email
    })
})

export const LoginUser=asyncHandler(async (req:express.Request,res:express.Response)=>{
    const loginUser:loginParams=req.body;

    if (!loginUser.email || !loginUser.password) throw new CustomError("Enter All required fields",400);

    if (loginUser.email.length > 130 || loginUser.password.length > 16) throw new CustomError("Input string parameter is too long",413);

    const user:LooseObject| null=await User.findOne({email:loginUser.email});

    if (!user){
        throw new CustomError("User doesn't exit, please register", 404);
    }

    const token:string=await user.getJwtToken();

    res.status(200).json({
        success:true,
        token
    })
})