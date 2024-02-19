import User from '../Models/User.model.js'
import bcryptjs from 'bcryptjs'
import { errorhandler } from '../utils/error.js'
import Listing from '../Models/Listing.model.js'

export const test=(req,res)=>{
    res.json({message:'testing route is working'})
}
export const updateuser=async(req,res,next)=>{
    if(req.user.id!==req.params.id)
    return next(errorhandler(401,"you can only update your onw account!"))
    try{
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }
        const updateuser=await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    avatar:req.body.avatar,
                },
            },
            {new:true}
        )
        const{password,...rest}=updateuser._doc
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}
export const deleteuser=async(req,res,next)=>{
    if(req.user.id!==req.params.id){
        return next(errorhandler(401,"You can only delete your own account!"))
    }
    try{
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie("accesstoken")
        res.status(200).json("user has been deleted")
    }catch(err){
        next(err)
    }

}
export const getuserlisting=async(req,res,next)=>{
   
   if(req.user.id===req.params.id){
    try{
        const listings= await Listing.find({userRef:req.params.id})
        res.status(201).json(listings)
    }catch(err){
        next(err)
    }
   }else{
    return next(errorhandler(401,"you can only view your own listings!"))
    
   }

}
export const getuser=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user){
            return next(errorhandler(401,'User not found!'))
        }
        const{password:pass,...rest}=user._doc
        res.status(200).json(rest)
    }catch(err){
        next(err)
    }
}