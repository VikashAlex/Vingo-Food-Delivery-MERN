import { useSelector } from "react-redux";
import Header from "./Header";
import { useEffect, useState } from "react";
import { AxiosInstance, formatINRCurrency } from "../utils/helper";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { toast } from "react-toastify";
function DeliveryBoy() {
  const { userData } = useSelector(state => state.user);
  const [AvailableAssignments, setAbailableAssignments] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [currentOrder, setCurrentOrder] = useState()
  const [otp, setOtp] = useState('')

  const handleSendOtp = (orderId, shopOrderId) => {

    AxiosInstance.post('/api/order/delivery-otp-send', { orderId, shopOrderId }).then((res) => {
      if (res.data.success) {
        setShowOtpBox(true)
        toast.success(res.data.message)
      }
    }).catch((err) => {
      console.log(err)
      toast.info(err.response.data.message)
    })
  }
  const handleVerifyOtp = (orderId, shopOrderId) => {
    if (!otp) {
      return alert('please enter otp..')
    }
    AxiosInstance.post('/api/order/delivery-otp-verify', { orderId, shopOrderId, otp }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message)
      }
    }).catch((err) => {
      console.log(err)
      toast.info(err.response.data.message)
    })
  }
  const getCurrentOrder = () => {
    AxiosInstance.get('/api/order/current-order').then((res) => {
      setCurrentOrder(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    AxiosInstance.get('/api/order/get-assigenment').then((res) => {
      setAbailableAssignments(res.data.formate)
    }).catch((err) => {
      console.log(err)
    })
    getCurrentOrder()
  }, [userData])

  const getAcceptOrder = (assignementId) => {
    AxiosInstance.get(`/api/order/accept-order/${assignementId}`).then((res) => {
      console.log(res.data)
      if (res.data.success) {
        getCurrentOrder()
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Header />
      <div className="w-full max-w-[800px] flex flex-col mt-20 gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2">

          <h1 className="text-xl font-bold text-[#ff4d2d] capitalize">
            Welcome, {userData.fullName}
          </h1>
          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitude:</span>{" "}
            {userData.location.coordinates[1]},
            <span className="font-semibold"> Longitude:</span>{" "}
            {userData.location.coordinates[0]}
          </p>

        </div>

        {
          currentOrder
            ?
            <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
              <h2 className="text-lg font-bold mb-3">📦 Current Order</h2>
              <div className="border rounded-lg p-4 mb-3">
                <p className="font-semibold text-sm">
                  {currentOrder.shopOrder.shop.shopName}
                </p>
                <p className="text-sm text-gray-500">
                  {currentOrder.deliveryAddress.text}
                </p>

                <p className="text-xs text-gray-400">
                  {currentOrder.shopOrder.shopOrderItem.length} items
                </p>

                <p className="text-xs text-gray-400">
                  {formatINRCurrency(currentOrder.shopOrder.subTotal)}
                </p>
              </div>

              <DeliveryBoyTracking data={currentOrder} />

              {!showOtpBox ? (
                <button
                  className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
                  onClick={() => handleSendOtp(currentOrder._id, currentOrder.shopOrder._id)}
                >
                  Mark As Delivered
                </button>
              ) : (
                <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                  <p className="text-sm font-semibold mb-2">
                    Enter OTP send to <span className="text-orange-500">{currentOrder.user.fullName}</span>
                  </p>

                  <input
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Enter OTP"
                  />

                  <button
                    onClick={() => handleVerifyOtp(currentOrder._id, currentOrder.shopOrder._id)}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all">
                    Submit OTP
                  </button>
                </div>
              )}

            </div>
            :
            <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
              <h1 className="text-lg font-bold mb-4 flex items-center gap-2">Available Orders</h1>
              <div className="space-y-4">
                {
                  AvailableAssignments?.length > 0
                    ?
                    AvailableAssignments?.map((a, index) => {
                      return <div className="border rounded-lg p-4 flex justify-between items-center  " key={index}>
                        <div>
                          <p className="text-sm font-semibold">{a.shopName}</p>
                          <p className="text-sm text-gray-500"> <span className="font-semibold">Delivery Address : </span>
                            {a?.deliveryAddress.text}
                          </p>
                          <p className="text-xs text-gray-400 ">{a?.items.length} items | {a?.subTotal} </p>
                        </div>
                        <button onClick={() => getAcceptOrder(a.assignementId)} className="bg-orange-500 px-3 py-1 text-white cursor-pointer text-sm font-semibold border-0 rounded-lg">
                          Accept
                        </button>
                      </div>
                    })

                    :
                    <p>No Available Orders</p>
                }

              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default DeliveryBoy