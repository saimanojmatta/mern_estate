import { useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const Listing = () => {
    const navigate=useNavigate()
    const[files,setfile]=useState([])
    const{currentuser}=useSelector((state)=>state.user)
    const[formdata,setformdata]=useState({
    imageurls:[],
    name:"",
    description:"",
    address:"",
    type:"rent",
    bedrooms:1,
    bathrooms:1,
    regularprice:50,
    discountprice:0,
    offer:false,
    parking:false,
    furnished:false,
    })
    const[imageuploaderr,setimageuploaderr]=useState(false)
    const [uploading,setuploading]=useState(false)
    const [error,seterror]=useState(false)
    const[loading,setloading]=useState(false)
   console.log(formdata)
    const handleimagesubmit=(e)=>{
        if(files.length>0 && files.length+formdata.imageurls.length<7){
            setuploading(true)
            setimageuploaderr(false)
            const promises=[]
            for(let i=0; i<files.length ;i++){
                promises.push(storageimage(files[i]))
            }
            Promise.all(promises).then((urls)=>{
                setformdata({...formdata,imageurls:formdata.imageurls.concat(urls)})
                setimageuploaderr(false)
                setuploading(false)
            }).catch((err)=>{
                setimageuploaderr("Image upload failed (2mb max per image)")
            })
        }else{
            setimageuploaderr("you can only upload 6 images per listing")
            setuploading(false)
        }
    }
    const storageimage=async(file)=>{
        return new Promise((resolve,reject)=>{
            const storage=getStorage(app)
            const filename=new Date().getTime()+file.name
            const storageref=ref(storage,filename)
            const uploadtask=uploadBytesResumable(storageref,file)
            uploadtask.on(
                'state_changed',
                (snapshot)=>{
                    const progress=
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    console.log(`Upload is ${progress}%done`)
                },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadtask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    })
                }
            )
        })
    }
    const handleremoveimage=(index)=>{
        setformdata({
            ...formdata,
            imageurls:formdata.imageurls.filter((_,i)=>i!==index)
        })

    }
    const handlechange=(e)=>{
        if(e.target.id==="rent"||e.target.id==="sale"){
            setformdata({...formdata,type:e.target.id})
        }
        if(e.target.id==="parking"||e.target.id==="offer"||e.target.id==="furnished"){
            setformdata({...formdata,[e.target.id]:e.target.checked})
        }
        if(e.target.type==="text"||e.target.type==="number"||e.target.type==="textarea"){
            setformdata({...formdata,[e.target.id]:e.target.value})
        }
    }
    const handlesubmit=async(e)=>{
        e.preventDefault()
        try{
            if(formdata.imageurls.length<1) return seterror("you must upload at least one image")
            if(+formdata.regularprice<+formdata.discountprice) return seterror("Discount price must be lower than regular price")
            setloading(true)
            seterror(false)
            const res=await fetch("/api/listing/create",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({...formdata,userRef:currentuser._id})
            })
            const data=await res.json()
            setloading(false)
            if(data.success===false){
                seterror(data.message)
            }
            navigate(`/listing/${data._id}`)

        }catch(err){
            seterror(err.message)
            setloading(false)

        }
    }
  return (
   <main className="p-3 max-w-4xl mx-auto">
    <h1 className="text-center my-7 font-semibold text-3xl">
        Create A Listing</h1>
    <form   onSubmit={handlesubmit} className="flex flex-col sm:flex-row gap-4" >
        <div className="flex flex-col gap-4 flex-1 ">
            <input type="text" placeholder="Name" className="border p-3 rounded-lg"
            id="name" maxLength='62'minLength="10" required onChange={handlechange} value={formdata.name}/>
            <textarea type="text" placeholder="Description" className="border p-3 rounded-lg"
            id="description"  required onChange={handlechange} value={formdata.description}/>
            <input type="text" placeholder="Address" className="border p-3 rounded-lg"
            id="address" maxLength='62'minLength="10" required onChange={handlechange} value={formdata.address}/>
            <div className="flex flex-wrap gap-6">
                <div className="flex gap-2 ">
                    <input type="checkbox" id="sale" className="w-5"
                    onChange={handlechange} checked={formdata.type==="sale"}/>
                    <span>Sell</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="rent" className="w-5" onChange={handlechange} checked={formdata.type==="rent"}/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="parking" className="w-5" onChange={handlechange} checked={formdata.parking}/>
                    <span>Parking Spot</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="furnished" className="w-5"onChange={handlechange} checked={formdata.furnished}/>
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="offer" className="w-5" onChange={handlechange} checked={formdata.offer}/>
                    <span>Offer</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                    <input className="p-3 border  border-gray-300 rounded-lg"
                     type="number" id="bedrooms"  min='1' max="10" required 
                     onChange={handlechange} value={formdata.bedrooms}/>
                    <p>Beds</p>
                </div>
                <div className="items-center flex gap-2">
                    <input className="p-3 border  border-gray-300 rounded-lg"
                     type="number" id="bathrooms"  min='1' max="10" required
                     onChange={handlechange} value={formdata.bathrooms}/>
                    <p>Baths</p>
                </div>
                <div className="gap-2 items-center flex ">
                    <input className="p-3 border  border-gray-300 rounded-lg"
                     type="number" id="regularprice"  min='50' max="1000000000" required
                     onChange={handlechange} value={formdata.regularprice}/>
                    <div className=" flex flex-col items-center ">
                        <p>Regular Price</p>
                        <span className="text-xs">($ / Month)</span>
                    </div>
                </div>
                {formdata.offer&&
                <div className="items-center flex">
                    <input className="p-3 border  border-gray-300 rounded-lg"
                     type="number" id="discountprice"  min='0' max="1000000000" required
                     onChange={handlechange} value={formdata.discountprice}/>
                    <div className=" flex flex-col items-center ">
                        <p>Discount Price</p>
                        <span className="text-xs">($ / Month)</span>
                    </div>
                </div>
                }
            </div>  
        </div>
        <div className="flex flex-col flex-1 gap-4"> 
            <p className="font-semibold">Images:
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
            </p>
            <div className="flex gap-4">
                <input onChange={(e)=>setfile(e.target.files)}  className="p-3 border border-gray-300 rounded w-full"type="file" id='images' multiple accept="image/* " />
                <button disabled={uploading} onClick={handleimagesubmit} className="p-3 text-green-700 border-green-700 border rounded uppercase 
                 hover:shadow-lg disabled:opactiy-80 ">{uploading?"Uploading...":"Upload"}</button>
            </div>
            <p className="text-red-700 tex-sm">{imageuploaderr && imageuploaderr}</p>
                {formdata.imageurls.length> 0 && formdata.imageurls.map((url,index)=>(
                    <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                        <button type="button"  onClick={()=>handleremoveimage(index)} className="text-red-700 p-3 rounded-lg uppercase hover:opacity-95 disabled:opactiy-75">Delete</button>
                    </div>
                ))}
        <button disabled={loading||uploading}  className="p-3  rounded-lg bg-slate-700 text-white  uppercase hover:opacity-95 disabled:opacity-80">
            {loading?"creating...":"create listing"}</button>
        {error && <p className="text-red-700 text-sm ">{error}</p>}
        </div>
    </form>   
   </main>
  )
}
export default Listing