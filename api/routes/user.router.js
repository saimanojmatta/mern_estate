import express from 'express'
import { deleteuser, getuser, getuserlisting, test, updateuser } from '../controllers/user.controller.js'
import { verifytoken } from '../utils/verifyuser.js'
const router=express.Router()
router.get('/test',test)
router.post('/update/:id',verifytoken,updateuser)
router.delete('/delete/:id',verifytoken,deleteuser)
router.get('/listing/:id',verifytoken,getuserlisting)
router.get('/:id',verifytoken,getuser)
export default router