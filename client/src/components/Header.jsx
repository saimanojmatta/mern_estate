import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
const Header = () => {
  const navigate=useNavigate()
  const{currentuser}=useSelector((state)=>state.user)
  const[searchTerm,setsearchTerm]=useState("")
  const handlesubmit=(e)=>{
    e.preventDefault()
    const urlparams=new URLSearchParams(window.location.search)
    urlparams.set("searchTerm",searchTerm)
    const searchquery=urlparams.toString()
    navigate(`/search?${searchquery}`)
  }
  useEffect(()=>{
    const urlparams=new URLSearchParams(location.search)
    const searchTermfromurl=urlparams.get('searchTerm')
    if(searchTermfromurl){
      setsearchTerm(searchTermfromurl)
    }
  },[location.search])
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
       <Link to ='/'>
       <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
        <span className="text-slate-500">Manoj</span>
        <span className="text-slate-700">Estate</span>
        </h1>
       </Link>
         <form onSubmit={handlesubmit}className='bg-slate-100 p-3 rounded-lg flex items-center '>
            <input className='bg-transparent focus:outline-none w-24 sm:w-64'
            type="text"placeholder="Search..."value={searchTerm} onChange={(e)=>setsearchTerm(e.target.value)} />
            <button>
              <FaSearch className='text-slate-600'/>
            </button>
         </form>
         <ul className='flex gap-4'>
          <Link to='/'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            Home
            </li>
          </Link>
        <Link to='/about'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            About
            </li>
        </Link>
        <Link to='/profile'>
          {currentuser?(
            <img className='rounded-full h-7 w-7 object-cover' 
            src= {currentuser.avatar} alt="profile" />
          ):(
          <li className='text-slate-700 hover:underline '>
            Sign in
            </li>
          )}
        </Link>
         </ul>
      </div>
    </header>
  )
}
export default Header