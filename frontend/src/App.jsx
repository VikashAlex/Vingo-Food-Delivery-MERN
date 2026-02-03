import { Navigate, Route, Routes } from 'react-router'

import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
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
import Shop from './pages/Shop'
import { useEffect } from 'react'
import { setOrders } from './redux/userSlice'
import { socket } from './utils/helper'
import useGetBoyMyOrders from './hooks/useGetBoyMyOrders'
import Signup from './pages/Signup'

function App() {
  useGetCurrentUser()
  useGetCurrentCity()
  useGetMyShop()
  useGetShopInMyCity()
  useGetMyOrders()
  useGetBoyMyOrders()
  useGetUpdateLocation()
  const { userData, myOrders } = useSelector((state) => state.user)
  const dispatcher = useDispatch()

  useEffect(() => {
    if (!userData?._id) return;

    // agar socket already connected hai
    if (socket.connected) {
      socket.emit("identity", { userId: userData._id });
    }

    const handleConnect = () => {
      socket.emit("identity", { userId: userData._id });
    };
    const handleNewOrder = (data) => {
      dispatcher(setOrders([data, ...myOrders]));
    };

    socket.on("connect", handleConnect);
    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newOrder", handleNewOrder);
    };
  }, [userData?._id]);



  return (
    <Routes>
      <Route path='/sign-up' element={userData ? <Navigate to={'/'}></Navigate> : <Signup />}></Route>
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
      <Route path='/shop/:shopId' element={userData ? <Shop /> : <Navigate to={'/sign-in'}></Navigate>}></Route>
    </Routes>
  )
}

export default App