import React, { useState } from 'react'
import { MdPhone } from 'react-icons/md'
import { AxiosInstance, formatINRCurrency } from '../utils/helper'
import { useDispatch } from 'react-redux'
import { orderStsUpdate } from '../redux/userSlice'

function OwnerOrders({ data }) {
    const dispatcher = useDispatch()
    const [status, setStatus] = useState(data?.shopOrders?.status || null)
    const [availableBoys, setAbailableBoys] = useState([])
    const updateStshandel = (orderId, shopId) => {
        if (!status || !orderId || !shopId) {
            return alert("Somithing error")
        }
        AxiosInstance.put(`api/order/update-order-sts/${orderId}/${shopId}`, { status }).then((res) => {
            if (res.data.success) {
                dispatcher(orderStsUpdate({ orderId, shopId, status }))
                setAbailableBoys(res.data.availableBoys)
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
                <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">Payment Mode : <span className='text-[#ff4d2d] uppercase font-bold text-[10px]'>{data.paymentMethod == "online" ? "online" : "case on delivery"}</span></p>
                {
                    data?.paymentMethod == "online" &&
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">Payment Status :
                        <p className={`text-sm py-1 ${data.payment ? "text-green-500" : "text-red-500"}`}> {data.payment ? "Payment is Successfull" : "Payment is faild"} </p>
                    </div>
                }

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

            <div className='flex md:flex-row flex-col items-center gap-4 md:gap-0 justify-between'>
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

            {
                data?.shopOrders.status === "out of delivery" &&
                <div className='mt-3 p-2 border rounded-lg text-sm bg-orange-50'>
                    {
                        data.shopOrders.assignedDeliveryBoy ?
                            <p>Assigned Delivery Boy</p>
                            :
                            <p>Available Delivery Boys</p>
                    }
                    {
                        availableBoys?.length > 0
                            ?
                            availableBoys?.map((b, index) => {
                                return <div key={index}>
                                    <p className='capitalize'>Name: {b.fullName}</p>
                                    <p>Mobile: {b.mobile}</p>
                                </div>
                            })
                            :
                            data?.shopOrders.assignedDeliveryBoy ?
                                <div>
                                    <p className='capitalize'>{data?.shopOrders.assignedDeliveryBoy.fullName}</p>
                                    <p>{data?.shopOrders.assignedDeliveryBoy.mobile}</p>
                                </div>
                                :
                                <div>Waiting for assigen the order...</div>
                    }
                </div>
            }
            <div className='text-gray-800 font-semibold text-right'>
                Total:
                {
                    formatINRCurrency(data.totalAmount)
                }
            </div>
        </div>
    )
}

export default OwnerOrders