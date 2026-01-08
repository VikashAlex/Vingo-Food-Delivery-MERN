import { FaLocationDot } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { AxiosInstance } from "../utils/helper";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import { IoReceiptOutline } from "react-icons/io5";
function Header() {
    const navigate = useNavigate()
    const { userData, cityData, cartItems, myOrders } = useSelector((state) => state.user)
    const { shopData } = useSelector((state) => state.owner)
    const [showInfo, setShowInfo] = useState(false);
    const [showSearch, setShowSearch] = useState(false)
    const dispatcher = useDispatch()
    const signOutHandel = () => {
        AxiosInstance('/api/auth/signout').then((res) => {
            if (res.data.success) {
                dispatcher(setUserData(null))
                toast.success(res.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <header className="w-full h-20 flex items-center justify-between  md:justify-center gap-[30px] px-5 fixed top-0 z-50 bg-[#fff9f6] overflow-visible">
            <h1 className="text-xl font-bold mb-2 text-[#ff4d2d]">Vingo</h1>
            {userData.role == "user" && <div className="md:w-[60%] lg:w-[40%] h-[55px] bg-white shadow-lg rounded-lg hidden md:flex items-center gap-5">
                <div className="hidden md:flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
                    <FaLocationDot size={25} color="#ff4d2d" />
                    <div className="w-[80%] truncate text-gray-600">{cityData?.city || "india"}</div>
                </div>
                <div className="w-[80%] flex items-center overflow-hidden gap-2.5 px-2.5 ">
                    <FaSearch size={25} color="#ff4d2d" />
                    <input type="text" placeholder="Search delicious food..." className="px-2.5 text-gray-700 outline-0 w-full" />
                </div>
            </div>}

            {
                userData.role == "user" && showSearch &&
                <div className="w-[90%] md:hidden  h-[55px] bg-white shadow-lg rounded-lg flex items-center gap-5 fixed top-20">
                    <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
                        <FaLocationDot size={25} color="#ff4d2d" />
                        <div className="w-[80%] truncate text-gray-600">{cityData?.city || "india"}</div>
                    </div>
                    <div className="w-[80%] flex items-center overflow-hidden gap-2.5 px-2.5 ">
                        <FaSearch size={25} color="#ff4d2d" />
                        <input type="text" placeholder="Search delicious food..." className="px-2.5 text-gray-700 outline-0 w-full" />
                    </div>
                </div>
            }


            <div className="flex items-center gap-4 ">
                {userData.role == "user" ?
                    <>
                        {showSearch
                            ?
                            <RxCross2 size={30} color="#ff4d2d" className="md:hidden" onClick={() => setShowSearch(false)} />
                            :
                            <CiSearch size={30} color="#ff4d2d" className="md:hidden" onClick={() => setShowSearch(true)} />
                        }
                        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                            <FiShoppingCart size={25} color='#ff4d2d' />
                            <span className="absolute text-[#ff4d2d] -top-3 right-[-9px]">{cartItems.length}</span>
                        </div>
                        <button onClick={() => navigate('/my-orders')} className=" relative cursor-pointer  md:flex gap-2 items-center md:px-3  md:py-2 py-2 px-4  rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d]  md:text-sm font-medium">
                            <IoReceiptOutline size={15} />

                            <p  className="md:block hidden">My Orders</p>
                            <span className="absolute bg-[#ff4d2d] -top-3 -right-2 md:h-5 h-4 flex items-center justify-center md:w-5 w-4 md:p-0 p-3 rounded-full text-white">{myOrders?.length}</span>
                        </button>

                    </>
                    :
                    <>
                        <div className="flex items-center gap-4">
                            {shopData && <button onClick={() => navigate('/add-items')} className=" relative cursor-pointer  md:flex gap-2 items-center md:px-3  md:py-2 py-2 px-4 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] md:text-sm font-medium">
                                <FaPlus size={20} />
                                <p className="md:block hidden">Add Items</p>
                                <span className="absolute bg-[#ff4d2d] -top-3 -right-2 md:h-5 h-4 flex items-center justify-center md:w-5 w-4 md:p-0 p-3 rounded-full text-white">{shopData.items.length || 0}</span>

                            </button>
                            }
                            <button onClick={() => navigate('/my-orders')} className=" relative cursor-pointer hidden  md:flex gap-2 items-center md:px-3  md:py-2 py-2 px-4  rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d]  md:text-sm font-medium">
                                <IoReceiptOutline size={20} />
                                <p  className="md:block hidden">My Orders</p>
                                <span className="absolute bg-[#ff4d2d] -top-3 -right-2 md:h-5 h-4 flex items-center justify-center md:w-5 w-4 md:p-0 p-3 rounded-full text-white">{myOrders?.length}</span>
                            </button>
                        </div>
                    </>
                }


                <div onClick={() => setShowInfo(prev => !prev)} className="w-10 h-10 rounded-full bg-[#ff4d2d] flex items-center justify-center text-white text-[18px] uppercase font-semibold cursor-pointer">
                    {userData?.fullName?.slice(0, 1)}
                </div>


                {
                    showInfo
                    &&
                    <div className={`fixed top-20 right-[10%] ${userData.role =="deliveryBoy" ? "md:right-[40%]":"md:right-[25%]"} w-[180px] bg-white shadow-2xl rounded-xl p-4 flex flex-col font-semibold`}>
                        <div className="text-[14px] capitalize">{userData?.fullName}</div>
                        <div onClick={() => navigate('/my-orders')} className="md:hidden">My Orders</div>
                        <div onClick={signOutHandel} className="text-[#ff4d2d] cursor-pointer">log out</div>
                    </div>
                }
            </div>
        </header>
    )
}

export default Header