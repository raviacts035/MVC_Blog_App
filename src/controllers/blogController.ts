import Blog,{ IBlog} from '../models/blogSchema';
import express,{ Request, Response} from 'express';
import mongoose, {HydratedDocument} from 'mongoose';
import asyncHandler from '../helpers/asyncHandler';
import CustomError from '../helpers/CustomError';

type BlogStruct={
    title?:string,
    discription?:string
}

type BlogId={
    id?:string
}


// Method : POST
export const CreateBlog=asyncHandler(async (req:Request,res:Response)=>{
    
    const newParams:BlogStruct=req.body;
    
    if (!newParams?.title || !newParams?.discription){
        throw new CustomError('Enter All required Fields',406);
    }
    if (newParams.title.length < 4 || newParams.title.length > 120) throw new CustomError('title length should be between 4-120 char',406);
    
    if (newParams.discription.length < 100 || newParams.discription.length > 600) throw new CustomError('Discription length should be between 100-600 char',406);
    
    const newBlog:HydratedDocument<IBlog>=await Blog.create(newParams)
    if (!newBlog){
        throw new CustomError('Unable to create entry',408)
    }
    res.status(200).json({
        success: true,
        newBlog
    })
})

// Method : PUT
// Update Blog Controller
export const UpdateBlog=asyncHandler(async (req:Request,res:Response)=>{
    const targetBlogId:BlogId=req.params;
    const newParams:BlogStruct=req.body;

    if (!(newParams?.title || newParams?.discription)){
        throw new CustomError('At least one field is required',406);
    }

    if ( newParams?.title && (newParams.title.length < 4 || newParams.title.length > 120)) throw new CustomError('title length should be between 4-120 char',406);

    else if (newParams?.discription && (newParams.discription.length < 100 || newParams.discription.length > 600)) throw new CustomError('Discription length should be between 100-600 char',406);
    const updatedBlog:HydratedDocument<IBlog> | null=await Blog.findByIdAndUpdate(targetBlogId.id,newParams);

    if (!updatedBlog) throw new CustomError('Blog ID requested doesnt exists',404);

    res.status(200).json({
        success: true,
        updatedBlog
    })
})

// Method : GET
export const GetAllBlog=asyncHandler(async (req:Request,res:Response)=>{
    const AllBlogs:HydratedDocument<IBlog>[]=await Blog.find();

    res.status(200).json({
        success:true,
        AllBlogs
    })
})

// Method : DELETE
// Deleting Blogs
export const DeleteBlog=asyncHandler(async (req:Request,res:Response)=>{
    const targetBlogId:BlogId=req.params;

    const blogToDel:HydratedDocument<IBlog> | null=await Blog.findById(targetBlogId.id)

    if (!blogToDel) throw new CustomError("Requested Blog doesn't exist",404);

    await Blog.findByIdAndDelete(targetBlogId.id);

    res.status(200).json({
        success:true,
        message:'Blog successfully Deleted'
    })
})
