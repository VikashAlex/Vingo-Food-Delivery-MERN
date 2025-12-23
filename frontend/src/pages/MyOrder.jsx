import { IoIosArrowRoundBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import UserOrders from "../components/UserOrders"
import OwnerOrders from "../components/OwnerOrders"

function MyOrder() {
    const navigate = useNavigate()
    const { userData, myOrders } = useSelector(state => state.user)
    return (
        <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
            <div className="w-full max-w-[800px] p-4">
                <div className="flex items-center gap-5 mb-6">
                    <div className="z-10 cursor-pointer" onClick={() => navigate("/")} >
                        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
                    </div>
                    <h1 className="text-2xl font-bold text-start">
                        My Orders
                    </h1>
                </div>

                <div className="space-y-2 ">
                    {
                        myOrders?.map((data, index) => {
                            return (userData.role === "user"
                                ?
                                <UserOrders key={index} data={data} />
                                :
                                userData.role === "owner"
                                ?
                                <OwnerOrders key={index} data={data} />
                                :
                                null)
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default MyOrder