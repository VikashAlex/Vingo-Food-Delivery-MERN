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
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopInMyCity from './hooks/useGetShopInMyCity'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import OrderPlace from './pages/OrderPlace'
import MyOrder from './pages/MyOrder'
import useGetMyOrders from './hooks/useGetMyOrders'
import useGetUpdateLocation from './hooks/useGetUpdateLocation'
import TrackOrder from './pages/TrackOrder'

function App() {
  useGetCurrentUser()
  useGetCurrentCity()
  useGetMyShop()
  useGetShopInMyCity()
  useGetMyOrders()
  useGetUpdateLocation()
  const { userData } = useSelector((state) => state.user)
  return (
    <Routes>
      <Route path='/sign-up' element={userData ? <Navigate to={'/'}></Navigate> : <SignUp />}></Route>
      <Route path='/sign-in' element={userData ? <Navigate to={'/'}></Navigate> : <SignIn />}></Route>
      <Route path='/forgot-password' element={userData ? <Navigate to={'/'}></Navigate> : <ForgotPassword />}></Route>
      <Route path='/' element={!userData ? <Navigate to={'/sign-in'}></Navigate> : <Home />}></Route>
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={'/'}></Navigate>}></Route>
      <Route path='/add-items' element={userData ? <AddItem /> : <Navigate to={'/'}></Navigate>}></Route>
      <Route path='/edit-item/:id' element={userData ? <EditItem /> : <Navigate to={'/'}></Navigate>}></Route>
      <Route path='/cart' element={userData ? <CartPage /> : <Navigate to={'/'}></Navigate>}></Route>
      <Route path='/checkout' element={userData ? <Checkout /> : <Navigate to={'/'}></Navigate>}></Route>
      <Route path='/order-place' element={userData ? <OrderPlace /> : <Navigate to={'/sign-in'}></Navigate>}></Route>
      <Route path='/my-orders' element={userData ? <MyOrder /> : <Navigate to={'/sign-in'}></Navigate>}></Route>
      <Route path='/track-order/:orderId' element={userData ? <TrackOrder /> : <Navigate to={'/sign-in'}></Navigate>}></Route>
    </Routes>
  )
}

export default App