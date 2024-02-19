import { useState } from 'react'
import {Link ,useNavigate} from 'react-router-dom'
import{useDispatch, useSelector} from 'react-redux'
import { signinstart,signinfailure,signinsuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'
const Signin = () => {
  const[formdata,setformdata]=useState({})
  const{loading,error}=useSelector((state)=>state.user)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const handlesubmit=async(e)=>{
    e.preventDefault()
   try{
    dispatch(signinstart())
    const res=await fetch('/api/auth/signin',{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(formdata),
    })
    const data=await res.json()
    console.log(data)
    if(data.success===false){
     dispatch(signinfailure(data.message))
      return
    }
    dispatch(signinsuccess(data))
    navigate('/')
   }catch(err){
    dispatch(signinfailure(err.message))
   }
  }
  const handlechange=(e)=>{
    setformdata({...formdata,[e.target.id]:e.target.value})

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form  onSubmit={handlesubmit}   className='flex flex-col gap-4' >
        <input onChange={handlechange} className="border p-3 rounded-lg" type="email"
         placeholder="email" id="email" />
         <input onChange={handlechange}className="border p-3 rounded-lg" type="password"
         placeholder="password" id="password" />
         <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
          {loading?"Loading...":"Sign In"}
         </button>
         <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
        <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'> {error}</p>}
    </div>
  )
}
export default Signin