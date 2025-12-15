import { useSelector } from 'react-redux'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import UserDashboard from '../components/UserDashboard'
function Home() {
    const {userData} = useSelector((state)=>state.user)
  return (
    <section>
        {userData.role ==="user" && <UserDashboard/>}
        {userData.role ==="owner" && <OwnerDashboard/>}
        {userData.role ==="deliveryBoy" && <DeliveryBoy/>}
    </section>
  )
}

export default Home