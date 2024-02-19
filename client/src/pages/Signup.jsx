import { useState } from "react"
import { Link ,useNavigate} from "react-router-dom"
import OAuth from "../components/OAuth"

const Signup = () => {
  const[formdata,setformdata]=useState({})
  const[error,setError]=useState(null)
  const[loading,setloading]=useState(false)
  const navigate=useNavigate()
  const handlesubmit=async(e)=>{
    e.preventDefault()
    try{
      setloading(true)
      const res=await fetch('/api/auth/signup',{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata)
      })
      const data=await res.json()
      console.log(data)
      if(data.success===false){
        setloading(false)
        setError(data.message)
        return 
      }
      setloading(false)
      setError(null)
      navigate('/sign-in')
    }catch(err){
      setloading(false)
      setError(err.message)
    } 
  }
  const handlechange=(e)=>{
    setformdata({
      ...formdata,[e.target.id]:e.target.value
    })
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form  onSubmit={handlesubmit} className="flex  flex-col gap-4" >
        <input  className="border p-3 round-lg" id='username' type="text" placeholder="username" onChange={handlechange} />
        <input  className="border p-3 round-lg"  id="email" type="email" placeholder="email" onChange={handlechange}/>
        <input  className="border p-3 round-lg"  id="password" type="password" placeholder="password" onChange={handlechange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" >
          {loading?"Loading...":"Sign Up"}
          </button>
          <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
        <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}
export default Signup