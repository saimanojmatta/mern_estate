import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userrouter from './routes/user.router.js'
import authrouter from './routes/auth.router.js'
import listingrouter from './routes/listing.route.js'

import cookieParser from 'cookie-parser'
dotenv.config()
mongoose.connect(process.env.Mongo).then(()=>{
    console.log('Connected to Mongodb!')
}).catch((err)=>{
    console.log(err)
})
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/user',userrouter)
app.use('/api/auth',authrouter)
app.use('/api/listing',listingrouter)
//errorhandler middleware
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500
    const message=err.message||"Internal server Error"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})
app.listen(3000,()=>{
    console.log('server running on port 3000')
})