import express from "express"
import { verifytoken } from "../utils/verifyuser.js"
import { createlisting, deletelisting, getlisting, getlistings, updatelisting } from "../controllers/listing.controller.js"
const router=express.Router()
router.post('/create',verifytoken,createlisting)
router.delete('/delete/:id',verifytoken,deletelisting)
router.post('/update/:id',verifytoken,updatelisting)
router.get('/get/:id',getlisting)
router.get('/get',getlistings)
export default router