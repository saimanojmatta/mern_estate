import { useEffect, useRef, useState } from "react"
import {  useDispatch, useSelector } from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {app} from '../firebase'
import { updateuserfailure, updateuserstart, updateusersuccess,
  deleteuserfailure,deleteusersuccess,
  deleteuserstart, signoutstart } from "../redux/user/userSlice"
import {Link} from 'react-router-dom'
const Profile = () => {
  const fileref=useRef(null)
  const{currentuser,loading,error}=useSelector((state)=>state.user)
  const[file,setfile]=useState(undefined)
  const[fileper,setfileper]=useState(0)
  const[fileuploaderr,setfileuploaderr]=useState(false)
  const[formdata,setformdata]=useState({})
  const[updatesuccess,setupdatesuccess]=useState(false)
  const[showlistingerror,setshowlistingerror]=useState(false)
  const[userlistings,setuserlistings]=useState([])

 const dispatch = useDispatch()

  // console.log(formdata)
  useEffect(()=>{
    if(file){
      handlefileupload(file)
    }
  },[file])
  const handlefileupload=(file)=>{
    const storage=getStorage(app)
    const filename=new Date().getTime()+file.name
    const storageref=ref(storage,filename)
    const uploadtask=uploadBytesResumable(storageref,file)
    uploadtask.on('state_changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
      setfileper(Math.round(progress))
    },
    (error)=>{
      setfileuploaderr(true)
    },
    ()=>{
      getDownloadURL(uploadtask.snapshot.ref)
      .then((downloadURL)=>setformdata({...formdata,avatar:downloadURL}))
    }
    )
  }
  const handlechange=(e)=>{
    setformdata({...formdata,[e.target.id]:e.target.value})
    
  }
  const handlesubmit=async(e)=>{
    e.preventDefault()
    try{
      dispatch(updateuserstart())
      const res=await fetch(`/api/user/update/${currentuser._id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formdata)
      })
      const data=await res.json()
      if(data.success===false){
        dispatch(updateuserfailure(data.message))
        return;
      }
      dispatch(updateusersuccess(data))
      setupdatesuccess(true)
      console.log(updatesuccess)
    }catch(err){
      dispatch(updateuserfailure(err.message))
    }
  }
  const handledeleteuser=async()=>{
    try{
      dispatch(deleteuserstart())
     const res= await fetch(`/api/user/delete/${currentuser._id}`,{
        method:"DELETE",
      })
      const data= await res.json()
      if(data.success===false){
        dispatch(deleteuserfailure(data.message))
        return ;
      }
      dispatch(deleteusersuccess(data))
    }catch(err){
      dispatch(deleteuserfailure(err.message))
    }
  }
  const handlesignout=async()=>{
    try{
      dispatch(signoutstart())
      const res=await fetch('/api/auth/signout',)
      const data=res.json()
      if(data.success===false){
        dispatch(deleteuserfailure(data.message))
      }
      dispatch(deleteusersuccess(data))

    }catch(err){
      dispatch(deleteuserfailure(err.message))
    }
  }
  const handleshowlisting=async()=>{
    try{
      setshowlistingerror(false)
      const res=await fetch(`/api/user/listing/${currentuser._id}`)
      const data=await res.json()
      if(data.success===false){
        setshowlistingerror(true)
        return;
      }
      setuserlistings(data)

    }catch(error){
      setshowlistingerror(true)

    }

  }
  const handlelistingdelete=async(listingID)=>{
    try{
      const res=await fetch(`/api/listing/delete/${listingID}`,{
        method:"DELETE",
      })
      const data= await res.json()
      if(data.success===false){
        console.log(data.message)
        return;
      }
      setuserlistings((prev)=>prev.filter((listing)=>listing._id!==listingID))
    }catch(err){
      console.log(err.message)
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile</h1>
      <form onSubmit={handlesubmit} className="flex flex-col gap-4">
        <input onChange={(e)=>setfile(e.target.files[0])} type="file" ref={fileref} hidden accept="image/*"  />
        <img  onClick={()=>fileref.current.click()} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
         src={formdata.avatar||currentuser.avatar} alt="profile" />
         <p className="text-sm self-center font-semibold" >
          {fileuploaderr?(
            <span className="text-red-700">
              Error image upload(image must be less than 2mb)
            </span>
          ):(fileper > 0 && fileper<100?(
            <span className="text-slate-700">{`upLoading ${fileper}%`}</span>
          ):fileper===100 ?(
            <span className="text-green-700 ">Image Succesfully Uploaded</span>
          ):(
            ""
          )
          )}
         </p>
        <input type="text" placeholder="username" defaultValue={currentuser.username}
        className="border p-3 rounded-lg" id="username" onChange={handlechange} />
        <input type="email" placeholder="email"defaultValue={currentuser.email}
        className="border p-3 rounded-lg" id="email"  onChange={handlechange}/>
        <input type="password" placeholder="password"
        className="border p-3 rounded-lg" id="password" onChange={handlechange} />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg
         p-3 uppercase hover:opacity-95 disabled:opacity-80 ">{loading?"Loading...":"Update"}</button>
         
         <Link to={'/create-listing'}
         className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opactiy-95">
          Create Listing
         </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handledeleteuser}className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handlesignout} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
        <p className="text-red-700 mt-5 text-center text-lg font-semibold">{error? error:" "}</p>
        <p className="text-green-700 mt-5 text-center text-lg font-semibold">{updatesuccess?"User is Updated Succesfully":" "}</p>
        <button onClick={handleshowlisting}  className="text-green-700 w-full ">Show listings</button>
        <p className="text-red-700 mt-5">{showlistingerror?"error showing list":""}</p>
        {userlistings && userlistings.length>0 &&(
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">Your listing</h1>
            {userlistings.map((listing)=>(
              <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
                <Link to={`/listing/${listing._id}`}>
                  <img  className="w-16 h-16 object-contain"src={listing.imageurls[0]} alt="listingimage" />
                </Link >
                <Link to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline flex-1 truncate">
                  <p>{listing.name}</p>
                </Link >
                <div className="flex flex-col items-center">
                  <button onClick={()=>handlelistingdelete(listing._id)}  className="text-red-700 uppercase">delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))
            }
          </div>
        )}
    </div>
  )
}
export default Profile