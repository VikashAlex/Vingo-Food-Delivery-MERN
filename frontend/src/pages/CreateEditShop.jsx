import { FaUtensils } from "react-icons/fa6"
import { useNavigate } from "react-router"
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AxiosInstance } from "../utils/helper";
import { toast } from "react-toastify";
import { setShopData } from "../redux/ownerSlice";
function CreateEditShop() {
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const { shopData } = useSelector((state) => state.owner)
    
    const { cityData } = useSelector((state) => state.user)
    const [forminfo, setForminfo] = useState({
        shopName: shopData?.shopName || "",
        image: shopData?.image || null,
        state: shopData?.state || cityData?.state || "",
        city: shopData?.city || cityData?.city || "",
        address: shopData?.address || cityData?.address_line2 || "",
    })
    const [imgUrl, setImgUrl] = useState(null)
    const imagehandel = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForminfo({ ...forminfo, image: file });
            setImgUrl(URL.createObjectURL(file))
        }
    }
    const sumithandel = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('shopName', forminfo.shopName)
        formData.append('state', forminfo.state)
        formData.append('city', forminfo.city)
        formData.append('address', forminfo.address)
        if (forminfo.image) {
            formData.append('image', forminfo.image)
        }
        AxiosInstance.post('api/shop/create-edit', formData).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message)
                dispatcher(setShopData(res.data.shop))
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return (

        <div className="flex justify-center flex-col items-center p-0 bg-linear-to-br from-orange-50 relative to-white min-h-screen">
            <div
                className="absolute top-5 left-5 z-2.5 mb-2.5"
                onClick={() => navigate('/')}>
                <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
            </div>

            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
                <div className="flex items-center flex-col mb-6">
                    <div className="bg-orange-100 p-4 rounded-full mb-4">
                        <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900">
                        {shopData ? "Edit Shop" : "Add Shop"}
                    </div>
                </div>

                <form className="space-y-4" onSubmit={sumithandel}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ShopName</label>
                        <input onChange={(e) => setForminfo({ ...forminfo, shopName: e.target.value })} type="text" placeholder="Enter Shop Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input onChange={(e) => imagehandel(e)} type="file" accept="image/*" placeholder="Enter Shop image" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />

                        {imgUrl && <div className="mt-4">
                            <img src={imgUrl} alt="shop-img" className="w-full h-48 rounded-lg object-cover object-center" />
                        </div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input onChange={(e) => setForminfo({ ...forminfo, state: e.target.value })} value={forminfo.state} type="text" placeholder="Enter State Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input onChange={(e) => setForminfo({ ...forminfo, city: e.target.value })} value={forminfo.city} type="text" placeholder="Enter City Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input onChange={(e) => setForminfo({ ...forminfo, address: e.target.value })} value={forminfo.address} type="text" placeholder="Enter Shop Address" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>


                    <button className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer" >
                        Save
                    </button>
                </form>
            </div>


        </div>
    )
}

export default CreateEditShop