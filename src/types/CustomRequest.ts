import mongoose from "mongoose";
import express from 'express';
import { IUser } from '../models/userSchema';


interface CustomRequest extends express.Request{
    user:mongoose.HydratedDocument<IUser>| null;
}

export default CustomRequest