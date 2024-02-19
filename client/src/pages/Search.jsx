import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import Listingitem from "../components/Listingitem"
const Search = () => {
    const navigate=useNavigate()
    const[sidebardata,setsidebardata]=useState({
        searchTerm:"",
        type:"all",
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:"desc"
    })
    const [loading,setloading]=useState(false)
    const[listing,setlisting]=useState([])
    const[showmore,setshowmore]=useState(false)
    // console.log(listing)
    useEffect(()=>{
        const urlparams=new URLSearchParams(location.search)
        const searchtermfromurl=urlparams.get("searchTerm")
        const typefromurl=urlparams.get("type")
        const parkingfromurl=urlparams.get('parking')
        const furnishedfromurl=urlparams.get('furnished')
        const offerfromurl=urlparams.get('offer')
        const sortfromurl=urlparams.get('sort')
        const orderfromurl=urlparams.get('order')
        if(
            searchtermfromurl||
            typefromurl||
            parkingfromurl||
            furnishedfromurl||
            offerfromurl||
            sortfromurl||
            orderfromurl
        ){
            setsidebardata({searchTerm:searchtermfromurl||"",
            type:typefromurl||"all",parking:parkingfromurl==="true"?true:false,
            furnished:furnishedfromurl==="true"?true:false,
            offer:offerfromurl==="true"?true:false,
            sort:sortfromurl||"created_at",
            order:orderfromurl||"desc"
        })
        }
        const fetchlisting=async()=>{
            setloading(true)
            setshowmore(false)
            const searchquery=urlparams.toString()
            const res=await fetch(`/api/listing/get?${searchquery}`)
            const data=await res.json()
            if(data.length>8){
                setshowmore(true)
            }else{
                setshowmore(false)
            }
            setlisting(data)
            setloading(false)
        }
        fetchlisting()
        
    },[location.search])
    // console.log(sidebardata)
    const handlechange=(e)=>{
        if(e.target.id==="all"||e.target.id==="rent"||e.target.id==="sale"){
            setsidebardata({...sidebardata,type:e.target.id})
        }
        if(e.target.id==="searchTerm"){
            setsidebardata({...sidebardata,searchTerm:e.target.value})

        }
        if(e.target.id==="parking"||e.target.id==="furnished"||e.target.id==="offer"){
            setsidebardata({...sidebardata,[e.target.id]:e.target.checked||e.target.checked==="true"?true:false})
        }
        if(e.target.id==="sortorder"){
            const sort=e.target.value.split("_")[0]||"created_at"
            const order=e.target.value.split("_")[1]||"desc"
            setsidebardata({...sidebardata,sort,order})
        }
    }
    const handlesubmit=(e)=>{
        e.preventDefault()
        const urlparams=new URLSearchParams()
        urlparams.set('searchTerm',sidebardata.searchTerm)
        urlparams.set("type",sidebardata.type)
        urlparams.set("parking",sidebardata.parking)
        urlparams.set("furnished",sidebardata.furnished)
        urlparams.set("offer",sidebardata.offer)
        urlparams.set("sort",sidebardata.sort)
        urlparams.set("order",sidebardata.order)
        const searchquery=urlparams.toString()
        navigate(`/search?${searchquery}`)
    }
    const onshowmoreclick=async()=>{
        const numberoflistings=listing.length
        const startIndex=numberoflistings
        const urlparams=new URLSearchParams(location.search)
        urlparams.set('startIndex',startIndex)
        const searchquery=urlparams.toString()
        const res=await fetch(`/api/listing/get?${searchquery}`)
        const data=await res.json()
        if(data.length<9){
            setshowmore(false)
        }
        setlisting([...listing,...data])
    }
  return (
    <div className="flex flex-col md:flex-row">
        <div className="p-7 border-2 md:border-r-2 md:min-h-screen">
            <form  onSubmit={handlesubmit} className="flex flex-col gap-8" >
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap font-semibold" >
                        SearchTerm:
                    </label>
                    <input type="text" id="searchTerm" placeholder="Search.."  value={sidebardata.searchTerm}
                    className="border rounded-lg p-3 w-full"onChange={handlechange}/>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="font-semibold" >Type:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="all" checked={sidebardata.type==="all"}
                        className="w-5"onChange={handlechange} />
                        <span>Rent & sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" checked={sidebardata.type==="rent"}
                        className="w-5"onChange={handlechange} />
                        <span>Rent </span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" checked={sidebardata.type==="sale"}
                         className="w-5" onChange={handlechange}/>
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className="w-5"
                        onChange={handlechange} checked={sidebardata.offer} />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap itesm-center">
                    <label className="font-semibold" >Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className="w-5"
                        onChange={handlechange} checked={sidebardata.parking} />
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className="w-5"
                        onChange={handlechange}  checked={sidebardata.furnished} />
                        <span>Furnished </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold" >Sort:</label>
                    <select onChange={handlechange} defaultValue={"created_at_desc"}
                     className="border rounded-lg p-3" id="sortorder">
                        <option value="regularprice_desc">Price high to low</option>
                        <option value="regularprice_asc">Price low to high</option>
                        <option value="createdat_desc">Latest</option>
                        <option value="createdat_asc">Oldest</option>
                    </select>
                </div>
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                    Search
                </button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
                Listing Results:
            </h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && listing.length===0 &&(
                    <p className="text-xl text-slate-700">
                        No listing found!
                    </p>
                )}
                {loading && (
                    <p className="text-xl text-slate-700 text-center w-full" >Loading...</p>
                )}
                {!loading && listing && listing.map((list)=>(
                    <Listingitem key={list._id} list={list}/>
                ))}
                {showmore &&(
                    <button onClick={onshowmoreclick} className="text-green-700 hover:underline p-7 text-center w-full">
                        Show more
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}
export default Search