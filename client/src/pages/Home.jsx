import {Link} from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { useEffect, useState } from 'react';
import Listingitem from '../components/Listingitem';
const Home = () => {
  const[offerlistings,setofferlistings]=useState([])
  const [salelistings,setsalelistings]=useState([])
  const[rentlistings,setrentlistings]=useState([])
  SwiperCore.use([Navigation])
  console.log(offerlistings,rentlistings,salelistings)
  useEffect(()=>{
    const fetchofferlistings=async()=>{
      try{
        const res=await fetch(`/api/listing/get?offer=true&limit=6`)
        const data=await res.json()
        setofferlistings(data)
        fetchrentlistings()
      }catch(err){
        console.log(err)
      }
    }
    const fetchrentlistings=async()=>{
      try{
        const res =await fetch(`/api/listing/get?type=rent&limit=6`)
        const data=await res.json()
        setrentlistings(data)
        fetchsalelistings()
      }catch(err){
        console.log(err)
      }
    }
    const fetchsalelistings=async()=>{
      try{
        const res=await fetch(`/api/listing/get?type=sale&limit=6`)
        const data=await res.json()
        setsalelistings(data)
      }catch(err){
        console.log(err)
      }
    }
    fetchofferlistings()

  },[])
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br/>
          place withe ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Manoj Estate is the best place to find your next perfect place to live
          <br />We have a wide range of properties for you to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get Started...
        </Link>
      </div>
      <Swiper navigation>
        {offerlistings && offerlistings.length>0 && (
          offerlistings.map((listing)=>(
            <SwiperSlide>
              <div className='h-[550px]' key={listing._id}
              style={{background:`url(${listing.imageurls[0]})center no-repeat`,backgroundSize:"cover"}}
              ></div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerlistings && offerlistings.length>0 && (
          <div>
            <div className='my-3' >
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline'
              to={"/search?offer=true"}>Show more offers</Link>
            </div>
            <div className=' flex flex-wrap gap-4'>
              {offerlistings.map((listing)=>(
                <Listingitem list={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentlistings && rentlistings.length>0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>
                Show more places for rent
              </Link>
                </div>
              <div className='flex flex-wrap gap-4'>
                {rentlistings.map((listing)=>(
                  <Listingitem list={listing} key={listing._id}/>
                ))}
              </div>
          </div>
        )}
        {salelistings && salelistings.length>0 &&(
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link to={`/search?type=sale`}className='text-sm text-blue-800 hover:underline'>
              Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4' >
              {salelistings.map((listing)=>(
                <Listingitem key={listing._id} list={listing}/>
              )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Home