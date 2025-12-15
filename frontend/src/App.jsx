import { Navigate, Route, Routes } from 'react-router'
import SignUp from './pages/Signup'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCurrentCity from './hooks/useGetCurrentCity'
import useGetMyShop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'

function App() {
  useGetCurrentUser()
  useGetCurrentCity()
  useGetMyShop()
  const { userData } = useSelector((state) => state.user)
  return (
    <Routes>
      <Route path='/sign-up' element={userData ? <Navigate to={'/'}></Navigate> : <SignUp />}></Route>
      <Route path='/sign-in' element={userData ? <Navigate to={'/'}></Navigate> : <SignIn />}></Route>
      <Route path='/forgot-password' element={userData ? <Navigate to={'/'}></Navigate> : <ForgotPassword />}></Route>
      <Route path='/' element={!userData ? <Navigate to={'/sign-in'}></Navigate> : <Home />}></Route>
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={'/'}></Navigate>}></Route>
    </Routes>
  )
}

export default App