
import { FaTrashAlt } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa6'
import { AxiosInstance, formatINRCurrency } from '../utils/helper'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setShopData } from '../redux/ownerSlice'

function OwnerItemsCard({ data }) {
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const deleteItem = (id) => {
        AxiosInstance.delete(`api/item/delete-item/${id}`).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message)
                dispatcher(setShopData(res.data.shop))
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
            <div className="w-36 h-auto shrink-0 bg-gray-50">
                <img src={data?.image} alt="" className="w-full h-full object-cover object-center" />
            </div>

            <div className="flex flex-col justify-between p-3 flex-1">
                <div>
                    <h2 className="text-base font-semibold text-[#ff4d2d]">
                        {data?.itemName}
                    </h2>

                    <p>
                        <span className="font-medium text-gray-700">Category:</span>{" "}
                        {data?.category}
                    </p>

                    <p>
                        <span className="font-medium text-gray-700">Food Type:</span>{" "}
                        {data?.foodType}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-[#ff4d2d] font-bold">
                        {formatINRCurrency(data?.price)}
                    </div>

                    <div className='flex items-center gap-3 text-[#ff4d2d]'>
                        <FaPen
                            className='cursor-pointer'
                            onClick={() => navigate(`/edit-item/${data._id}`)}
                        />
                        <FaTrashAlt onClick={() => deleteItem(data._id)} className='cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OwnerItemsCard