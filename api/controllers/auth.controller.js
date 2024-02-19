import User from "../Models/User.model.js";
import bcryptjs from 'bcryptjs'
import { errorhandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup=async(req,res,next)=>{
    const{username,email,password}=req.body
    const hashedpassword=bcryptjs.hashSync(password,10)
    try{
        const user=await User.create({
            username,
            email,
            password:hashedpassword
        })
        res.status(201).json({message:"a user created😃!"})
    }
    catch(err){
        next(err)
    }
}
export const signin=async(req,res,next)=>{
    const{email,password}=req.body
    try{
       const validuser= await User.findOne({email})
       if(!validuser) return next(errorhandler(404,'User not found!'))
       const validpassword=bcryptjs.compareSync(password,validuser.password)
       if(!validpassword) return next(errorhandler(401,"wrong credentials!"))
       const token=jwt.sign({id:validuser._id},process.env.JWT_SECRET)
       const{password:pass,...rest}=validuser._doc
       res.cookie("accesstoken",token,{httpOnly:true}).status(200).json(rest)
   }catch(err){
    next(err)
   }
}
export const google=async(req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            const{password:pass,...rest}=user._doc
            res.cookie("accesstoken",token,{httpOnly:true}).status(200).json(rest)
        }
        else{
            const generatedpassword=Math.random().toString(36).slice(-8)+
            Math.random().toString(36).slice(-8)
            const hashedpassword=bcryptjs.hashSync(generatedpassword,10)
            const user=await  User.create({
                username:req.body.name.split(" ").join("").toLowerCase()+
                Math.random().toString(36).slice(-4),
                email:req.body.email,
                password:hashedpassword,
                avatar:req.body.photo
            })
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            const{password:pass,...rest}=user._doc
            res.cookie("accesstoken",token,{httpOnly:true}).status(200).json(rest)
        }
    }catch(err){
        next(err)
    }
}
export const signout=async(req,res,next)=>{
    try{
        res.clearCookie("accesstoken")
        res.status(200).json("user has been loged out!")
    }catch(err){
        next(err)
    }
}