import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import config from "../config";

export interface IUser {
    name: string;
    email: string;
    password: string;
  }

const userSchema=new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:[true,"Name is required"],
        maxLength:[40,"Name must be less then 50 Chars"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        maxlength:[130,"Email length should not be greater then 130 charecters"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:[8,"Password should be minimus 8 char"],
        maxlength:[16,"Password should not be greater then 16 charecters"],
        select:false
    }
}, {timestamps:true})


userSchema.pre("save",async function(next:Function){
    if (!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password as string,10)
})

userSchema.methods={
    comparePassword:async function(plainPass:string){
        return await bcrypt.compare(plainPass, this.password);
    },
    getJwtToken:function(){
        return JWT.sign({_id:this._id},config.JWT_secret!,{expiresIn:config.JWT_Expiry!})
    }
}


export default mongoose.model("User",userSchema);