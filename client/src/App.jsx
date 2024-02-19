import{Route,Routes,BrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Listing from './pages/Listing'
import Updatedlisting from './pages/Updatedlisting'
import Showlisting from './pages/Showlisting'
import Search from './pages/Search'
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<Signup/>}/>
      <Route path='/search' element={<Search/>}/>
      <Route path='/listing/:listingId' element={<Showlisting/>}/>
      <Route path='/about' element={<About/>}/>
      <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/create-listing' element={<Listing/>}/>
      <Route path='/update-listing/:listingId' element={<Updatedlisting/>}/>
      </Route>
      
    </Routes>
    </BrowserRouter>

    
  )
}