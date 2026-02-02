import { useNavigate } from "react-router";
import { AxiosInstance, formatINRCurrency } from "../utils/helper";
import { useState } from "react";
function UserOrders({ data }) {
    const navigate = useNavigate()
    const [selectratting, setSelectRatting] = useState({})
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
    const handelRatting = (itemId, ratting) => {
        AxiosInstance.post('/api/item/ratting', { itemId, ratting }).then((res) => {
            console.log(res)
            if (res.data.success) {
                setSelectRatting(prev => ({
                    ...prev, [itemId]: ratting
                }))
               
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div className="flex justify-between border-b pb-2">
                <div>
                    <p className="font-semibold">
                        Order #{data?._id?.slice(-6)}
                    </p>
                    {
                        data?.paymentMethod == "online" &&
                        <p className="py-1">Payment :</p>
                    }
                    <p className="text-sm text-gray-500">
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        {data.paymentMethod?.toUpperCase()}

                    </p>
                    {
                        data?.paymentMethod == "online" &&
                        <p className={`text-sm py-1 ${data.payment ? "text-green-500" : "text-red-500"}`}> {data.payment ? "Payment is Successfull" : "Payment is faild"} </p>
                    }

                    <p className="font-medium text-blue-600">
                        {data.shopOrders?.[0].status}
                    </p>
                </div>
            </div>
            {data.shopOrders.map((shopOrder, index) => (
                <div
                    className=" rounded-lg p-3 bg-[#fffaf7] space-y-3"
                    key={index}
                >
                    <p>{shopOrder.shop.shopName}</p>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {shopOrder.shopOrderItem.map((item, index) => (
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

                                {shopOrder.status === "delivered" &&
                                    <div className="flex space-x-1 mt-2">
                                        {
                                            [1, 2, 3, 4, 5].map((star) =>
                                                <button onClick={() => handelRatting(item.item._id, star)} className={`text-lg ${selectratting[item.item._id] >= star ? 'text-yellow-500' : 'text-gray-500'}`}>★</button>
                                            )
                                        }
                                    </div>
                                }

                            </div>


                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                        <p className="font-semibold">Subtotal:{formatINRCurrency(shopOrder.subTotal)}</p>
                        <span className="font-bold text-blue-600 text-sm">{shopOrder.status}</span>
                    </div>


                </div>

            ))}

            <div className="flex justify-between items-center pt-2 border-t">
                <p className="font-semibold">Total:{formatINRCurrency(data.totalAmount)}</p>
                <button onClick={() => navigate(`/track-order/${data._id}`)} className="font-semibold bg-[#ff4d2d] text-white py-2 px-4 rounded-lg cursor-pointer  text-sm">Track Order</button>
            </div>

        </div>
    )
}

export default UserOrders