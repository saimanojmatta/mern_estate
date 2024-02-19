import {errorhandler} from './error.js'
import jwt from 'jsonwebtoken'
export const verifytoken=(req,res,next)=>{
    const token=req.cookies.accesstoken
    if(!token) return next(errorhandler(401,"unauthrozied"))
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
      if(err) return next(errorhandler(403,"Forbidden "))
      req.user=user
       next()
    })
}