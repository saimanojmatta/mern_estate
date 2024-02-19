import {  useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
const PrivateRoute = () => {
  const{currentuser}=useSelector((state)=>state.user)
  return currentuser?<Outlet/>:<Navigate to="/sign-in"/>
 
}
export default PrivateRoute