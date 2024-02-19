import { GoogleAuthProvider, getAuth, signInWithPopup, }from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signinsuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    const navigate=useNavigate()
   const dispatch= useDispatch()
    const handlegoogleclick=async()=>{
        try{
            const provider=new GoogleAuthProvider()
            const auth=getAuth(app)
            const result=await signInWithPopup(auth,provider)
            const res= await fetch('/api/auth/google',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    photo:result.user.photoURL,
                })
            })
            const data= await res.json()
            console.log(data)
            dispatch(signinsuccess(data))
            navigate('/')
         
        }catch(err){
            console.log('could not sign-in with google',err)
        }
    }
  return (
    <button onClick={handlegoogleclick} type='button' className="bg-red-700 text-white uppercase
     p-3 border rounded-lg hover:opacity-95 ">
        Continue with google
    </button>
  )
}
export default OAuth