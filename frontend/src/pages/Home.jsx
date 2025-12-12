import { useSelector } from 'react-redux'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import UserDashboard from '../components/UserDashboard'
import Header from '../components/Header'

function Home() {
    const {userData} = useSelector((state)=>state.user)
  return (
    <section className='w-screen min-h-screen flex justify-center items-center flex-col bg-[#fff9f6]'>
       <Header/>
        {userData.role ==="user" && <UserDashboard/>}
        {userData.role ==="owner" && <OwnerDashboard/>}
        {userData.role ==="deliveryBoy" && <DeliveryBoy/>}
    </section>
  )
}

export default Home