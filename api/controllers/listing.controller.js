import Listing from "../Models/Listing.model.js"
import { errorhandler } from "../utils/error.js"

export const createlisting=async(req,res,next)=>{
    try{
        const listing=await Listing.create(req.body)
        return res.status(201).json(listing)
    }catch(err){
        next(err)
    }
    
}
export const deletelisting=async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id)
    if(!listing){
        return next(errorhandler(401,"Listing is not found!"))
    }
    if(req.user.id!==listing.userRef){
        return next(errorhandler(401,"you can only delete your own listing!"))
    }
    try{
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted!')
    }catch(err){
        return next(err)
    }
}
export const updatelisting=async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id)
    if(!listing){
        return next(errorhandler(401,"User not found!"))
    }
    if(req.user.id!==listing.userRef){
        return next(errorhandler(401,"YOu can only update your own account"))
    }
    try{
        const updatedlisting=await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json(updatedlisting)
    }catch(err){
        return next(err)
    }
}
export const getlisting=async(req,res,next)=>{
    try{
        const listing=await Listing.findById(req.params.id)
        if(!listing){
            return next(errorhandler(401,"Listing is not found!"))
        }
        res.status(200).json(listing)
    }catch(err){
        return next(err)
    }
}
export const getlistings=async(req,res,next)=>{
    try{
        const limit=parseInt(req.query.limit)||9
        const startIndex=parseInt(req.query.startIndex)||0
        let offer=req.query.offer
        if(offer===undefined||offer==="false"){
            offer={$in:[false,true]}
        }
        let furnished=req.query.furnished
        if(furnished===undefined||furnished==="false"){
            furnished={$in:[false,true]}
        }
        let parking=req.query.parking
        if(parking===undefined||parking==="false"){
            parking={$in:[false,true]}
        }
        let type=req.query.type
        if(type===undefined||type==="all"){
            type={$in:["sale","rent"]}
        }
        const searchTerm=req.query.searchTerm||" "
        const sort=req.query.sort||"CreatedAt"
        const order=req.query.order||'desc'
        const listings=await Listing.find({
            name:{$regex:searchTerm,$options:'i'},
            offer,
            furnished,
            parking,
            type,
        })
        .sort({[sort]:order})
        .limit(limit)
        .skip(startIndex)
        return res.status(200).json(listings)
    }catch(err){
        next(err)
    }
}