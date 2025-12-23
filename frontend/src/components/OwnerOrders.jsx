import React, { useState } from 'react'
import { MdPhone } from 'react-icons/md'
import { AxiosInstance, formatINRCurrency } from '../utils/helper'
import { useDispatch } from 'react-redux'
import { orderStsUpdate } from '../redux/userSlice'

function OwnerOrders({ data }) {
    const dispatcher = useDispatch()
    const [status, setStatus] = useState(data?.shopOrders?.status || null)
    const updateStshandel = (orderId, shopId) => {
        if (!status || !orderId || !shopId) {
            return alert("Somithing error")
        }
        AxiosInstance.put(`api/order/update-order-sts/${orderId}/${shopId}`, { status }).then((res) => {
            if (res.data.success) {
                dispatcher(orderStsUpdate({ orderId, shopId, status }))
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">
                    {data.user.fullName}
                </h2>

                <p className="text-sm text-gray-500">
                    {data.user.email}
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MdPhone />
                    <span>{data.user.mobile}</span>
                </p>
            </div>

            <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
                <p>{data.deliveryAddress?.text}</p>

                <p className="text-xs text-gray-500">
                    Lat: {data.deliveryAddress?.latitude}, Lon: {data.deliveryAddress?.longitude}
                </p>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-2">
                {data.shopOrders.shopOrderItem.map((item, index) => (
                    <div
                        key={index}
                        className="shrink-0 w-40 border rounded-lg p-2 bg-white"
                    >
                        <img
                            src={item.item.image}
                            alt=""
                            className="w-full h-24 object-cover rounded"
                        />

                        <p className="text-sm font-semibold mt-1">
                            {item.item.itemName}
                        </p>

                        <p className="text-xs text-gray-500">
                            Qty: {item.qnty} × {formatINRCurrency(item.item.price)}
                        </p>

                    </div>
                ))}
            </div>

            <div className='flex items-center justify-between'>
                <p>Status: <span className='capitalize text-[#ff4d2d]'>{data?.shopOrders.status}</span></p>
                <div className='flex items-center gap-x-3'>
                    <select onChange={(e) => setStatus(e.target.value)} className='text-[#ff4d2d] border border-[#ff4d2d] outline-0 px-2 rounded-lg py-1'>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out of delivery">Out of delivery</option>
                        <option value="delivered">Delivered</option>
                    </select>
                    <button onClick={() => updateStshandel(data._id, data.shopOrders.shop._id)} className='rounded-lg  px-3 py-1 bg-[#ff4d2d] text-white shadow cursor-pointer'>Update</button>
                </div>

            </div>
            <div className='text-gray-800 font-semibold text-right'>
                Total:
                {
                    formatINRCurrency(data.shopOrders.subTotal)
                }
            </div>
        </div>
    )
}

export default OwnerOrders