import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
const Contact = ({listing}) => {
  const[landlord,setlandlord]=useState(null)
  const[message,setmessage]=useState(" ")
  console.log(landlord)
  useEffect(()=>{
    const fetchlandlord=async()=>{
      try{
        const res=await fetch(`/api/user/${listing.userRef}`)
        const data=await res.json()
        setlandlord(data)
      }catch(err){
        console.log(err)
      }
    }
    fetchlandlord()
  },[listing.userRef])
  return (
    <>
    {landlord && (
      <div className="flex flex-col gap-2">
        <p>
          Contact <span className="font-semibold">{landlord.username}</span>{" "}
          for{" "}
          <span className="font-semibold">{listing.name.toLowerCase()}</span>
        </p>
        <textarea name="message" id="message"  rows="2"
          value={message} placeholder="Enter your message here..."
          onChange={(e)=>setmessage(e.target.value)} className="w-full border p-3 rounded-lg"
        ></textarea>
        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
        Send Message
        </Link>
      </div>
    )}
    </>
  )
}
export default Contact