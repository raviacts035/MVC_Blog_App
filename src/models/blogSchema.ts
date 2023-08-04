import mongoose, { mongo } from "mongoose";

export interface IBlog{
    title:String,
    discription:string
}

const BlogSchema=new mongoose.Schema<IBlog>({
    title:{
        type: String,
        required:true,
        minlength:[4,"Minimum title length is 4 charecter's"],
        maxLength:[120,"Maximum title length is 120 charecter's"]
    },
    discription:{
        type:String,
        required:true,
        minlength:[100,"Minimum  discription length is 100 charecter's"],
        maxlength:[600,"Maximum discription length is 600 charecter's"]
    }
})


export default mongoose.model<IBlog>('Blog',BlogSchema);