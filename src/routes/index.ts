import { Router, Request, Response } from "express";
import authRoutes from "./authRoutes";
import BlogRoutes from "../routes/blogRoutes";


const routes=Router()

// Blog Routes
routes.use('/blog',BlogRoutes);

// auth routes
routes.use('/auth',authRoutes);

routes.get('/',(req:Request, res:Response)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the Blog App..."
    })
})

routes.all('*',(req:Request, res:Response)=>{
    res.status(404).json({
        success:false,
        message:"Oops!, path not found..."
    })
})

export default routes