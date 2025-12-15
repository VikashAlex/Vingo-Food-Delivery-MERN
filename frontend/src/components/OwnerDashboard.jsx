import { useSelector } from "react-redux"
import Header from "./Header"
import { FaUtensils } from "react-icons/fa6"
import { useNavigate } from "react-router"
import { MdModeEdit } from "react-icons/md";
import OwnerItemsCard from "../pages/OwnerItemsCard";
function OwnerDashboard() {
  const { shopData } = useSelector((state) => state.owner)
  const navigate = useNavigate()
  return (
    <>
      <Header />
      <main className='w-full min-h-screen flex justify-center mt-10 items-center flex-col gap-4 bg-[#fff9f6]'>
        {
          !shopData ?
            <div className='flex justify-center items-center p-4 sm:p-6'>
              <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                <div className='flex flex-col items-center text-center'>
                  <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
                  <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                    Add Your Restaurant
                  </h2>
                  <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                    Join our food delivery platform and reach thousands of hungry customers every day.
                  </p>
                  <button onClick={() => navigate('/create-edit-shop')} className='bg-[#ff4d2d] cursor-pointer text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'>
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            :
            <div className="w-full  flex flex-col items-center gap-6 px-4 py-4 sm:px-6 ">
              <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
                <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
                Welcome to {shopData.shopName}
              </h1>

              <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-2xl relative">
                <img
                  src={shopData.image}
                  alt={shopData.shopName}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{shopData.shopName}</h1>
                  <p className="text-gray-500">{shopData.state}</p>
                  <p className="text-gray-500 mb-4">{shopData.address}</p>
                </div>
                <div onClick={() => navigate('/create-edit-shop')} className="bg-[#ff4d2d] h-8 w-8 text-sm rounded-full absolute top-2 cursor-pointer right-2.5 text-white flex justify-center items-center">
                  <MdModeEdit />
                </div>
              </div>
            </div>
        }

        {
          shopData?.items?.length == 0 ?
            <div className='w-full flex justify-center items-center p-4 sm:p-6 '>
              <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                <div className='flex flex-col items-center text-center'>
                  <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
                  <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                    Add Your Items
                  </h2>
                  <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                    Join our food delivery platform and reach thousands of hungry customers every day.
                  </p>
                  <button onClick={() => navigate('/add-items')} className='bg-[#ff4d2d] cursor-pointer text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'>
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            :
            <div className="w-full  flex flex-col items-center gap-6 px-4 py-4 sm:px-6 ">
              {shopData?.items.map((data, index) => {
                return <OwnerItemsCard key={index} data={data} />
              })}
            </div>
        }

      </main>
    </>
  )
}

export default OwnerDashboard