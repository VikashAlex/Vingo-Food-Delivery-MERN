
import { IoIosArrowRoundBack } from 'react-icons/io'
import { TbCurrentLocation } from 'react-icons/tb'
import { FaMobileScreenButton } from 'react-icons/fa6'
import { FaCreditCard } from 'react-icons/fa'
import { IoLocationSharp, IoSearchOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { MdDeliveryDining } from "react-icons/md";
import { useNavigate } from 'react-router'
import "leaflet/dist/leaflet.css";
import { BeatLoader, BounceLoader, } from 'react-spinners'
import { setAddress, setPosition } from '../redux/mapSlice'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { AxiosInstance, formatINRCurrency } from '../utils/helper'
import { toast } from 'react-toastify'
import { addOrders } from '../redux/userSlice'

function ReCenterMap({ location }) {
    if (location.latitude && location.longtude) {
        const map = useMap()
        map.setView([location.latitude, location.longtude], 16, { animate: true })
    }
}

function Checkout() {
    const navigate = useNavigate()
    const dispatcher = useDispatch()
    const apiKey = import.meta.env.VITE_GEOAPIKEY
    const { position, address } = useSelector(state => state.map)
    const [inputValue, setInputValue] = useState(address?.formatted || "")
    const [flag, setFlag] = useState(true)
    const [flagSerach, setFlagSearch] = useState(true)
    const [PaymentMethod, setPaymentMethod] = useState('cod')
    const [loader, setLoader] = useState(false)
    const { myOrders } = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.user)
    const totalAmount = (cartItems.reduce((acu, item) => acu += item.qnty * item.price, 0)) || 0
    const deliveryFee = totalAmount ? totalAmount > 500 ? 0 : 40 : 0
    const AmountWithDeliveryFee = totalAmount + deliveryFee;

    const dradenHandel = (e) => {
        if (e.target._latlng) {
            const { lat, lng } = e.target._latlng
            dispatcher(setPosition({ long: lng, lati: lat }))
            axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`).then((res) => {
                if (res.data) {
                    dispatcher(setAddress(res.data.results[0]))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const goToCurrentAddress = () => {
        setFlag(false)
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { longitude, latitude } = position.coords
            axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`).then((res) => {
                if (res.data) {
                    dispatcher(setAddress(res.data.results[0]))
                    dispatcher(setPosition({ long: longitude, lati: latitude }))
                    setFlag(true)
                }
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    const getLocationText = (key = null) => {
        if (key == "Enter") {
            setFlagSearch(false)
            axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(inputValue)}&format=json&apiKey=${apiKey}`).then((res) => {
                if (res.data) {
                    const { lon, lat } = res.data.results[0]
                    dispatcher(setPosition({ long: lon, lati: lat }))
                    dispatcher(setAddress(res.data.results[0]))
                    setFlagSearch(true)
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    useEffect(() => {
        setInputValue(address?.formatted)
    }, [address])

    const sumitHandel = () => {
        setLoader(true)
        AxiosInstance.post('/api/order/place', {
            cartItems,
            paymentMethod: PaymentMethod,
            deliveryAddress: {
                text: inputValue,
                latitude: position.latitude,
                longitude: position.longtude,
            },
            totalAmount: AmountWithDeliveryFee
        }).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message)
                setLoader(false)
                dispatcher(addOrders(res.data.order))
                navigate('/order-place')
            }
        }).catch((err) => {
            console.log(err)
            setLoader(false)
        })
    }

    return (
        <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
            <div
                className="absolute top-5 left-5 z-10"
                onClick={() => navigate("/")}
            >
                <IoIosArrowRoundBack
                    size={35}
                    className="text-[#ff4d2d]"
                />
            </div>

            <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Checkout
                </h1>

                <section>
                    <h2 className="flex items-center gap-2 font-semibold text-gray-700">
                        <IoLocationSharp color='#ff4d2d' />
                        Delivery Location
                    </h2>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
                            placeholder="Enter Your Delivery Address"
                            value={inputValue}
                            onKeyDown={(e) => getLocationText(e.key)}
                            onChange={(e) => setInputValue(e.target.value)}
                        />

                        <button onClick={() => getLocationText("Enter")} className="bg-[#ff4d2d] hover:bg-[#e64528] text-white px-3 py-2 rounded-lg flex items-center justify-center">
                            {flagSerach ? <IoSearchOutline size={17} /> : <BounceLoader
                                color="#fff"
                                size={15}
                            />}
                        </button>

                        <button onClick={() => goToCurrentAddress()} className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
                            {flag ? <TbCurrentLocation size={17} /> : <BounceLoader
                                color="#fff"
                                size={15}
                            />}
                        </button>
                    </div>

                    <div className={`h-64 w-full overflow-hidden rounded-xl ${!position.latitude && "flex items-center justify-center flex-col"}`}>

                        {
                            position.latitude && position.longtude ?
                                <MapContainer
                                    center={[position?.latitude || 26.58333, position?.longtude || 73.83333]}
                                    zoom={16}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <ReCenterMap location={position} />
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <Marker position={[position?.latitude || 26.58333, position?.longtude || 73.83333]} draggable eventHandlers={{ dragend: dradenHandel }} />



                                </MapContainer>
                                :
                                <>
                                    <BounceLoader
                                        color="#e64528"
                                        size={204}
                                    />
                                    <span className='text-gray-400 mt-3 p-4'>Loading map...</span>
                                </>
                        }
                    </div>

                </section>

                <section>
                    <h2 className='text-lg font-semibold text-gray-800 mb-3'>Payment Method</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div onClick={() => setPaymentMethod("cod")} className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 text-left border transition ${PaymentMethod == "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"
                            }`}>
                            <span className='w-10 h-10 inline-flex items-center justify-center rounded-full'>
                                <MdDeliveryDining className='text-green-600 text-xl' />
                            </span>
                            <div>
                                <p className='font-medium text-gray-800'>Case On Delivery</p>
                                <p className=' text-xs text-gray-500'>Pay when your food arrives</p>
                            </div>

                        </div>
                        <div onClick={() => setPaymentMethod("online")} className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 text-left border transition ${PaymentMethod == "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"
                            }`}>
                            <span className='w-10 h-10 bg-purple-100 inline-flex items-center justify-center rounded-full'>
                                <FaMobileScreenButton className='text-purple-700 text-lg' />
                            </span>
                            <span className='w-10 h-10 bg-blue-100 inline-flex items-center justify-center rounded-full'>
                                <FaCreditCard className='text-blue-700 text-lg' />
                            </span>
                            <div>
                                <p className='font-medium text-gray-800'>UPI / Credit / Debit Card</p>
                                <p className=' text-xs text-gray-500'>Pay Securely Online</p>
                            </div>

                        </div>

                    </div>
                </section>

                <section>
                    <h2 className='text-lg font-semibold text-gray-800 mb-3'>Payment Summary</h2>
                    <div className="rounded-xl border bg-gray-50 p-4 space-y-2 mb-3">
                        {cartItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between text-sm text-gray-700"
                            >
                                <span>
                                    {item.itemName} x {item.qnty}
                                </span>

                                <span>
                                    {formatINRCurrency(item.price * item.qnty)}
                                </span>
                            </div>
                        ))}

                        <hr className="border-gray-200 my-2" />

                        <div className="flex justify-between font-medium text-gray-800">
                            <span>Subtotal</span>
                            <span>{formatINRCurrency(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-gray-800">
                            <span>Delivery Fee</span>
                            <span>{deliveryFee === formatINRCurrency(0) ? "Free" : formatINRCurrency(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
                            <span>Total</span>
                            <span>{formatINRCurrency(AmountWithDeliveryFee)}</span>
                        </div>
                    </div>
                    <button onClick={() => sumitHandel()} className="w-full cursor-pointer bg-[#ff4d2d] hover:bg-[#e64528] text-white py-3 rounded-xl font-semibold">
                        {loader ? <BeatLoader size={12} color="#ffffff" /> : PaymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
                    </button>
                </section >
            </div >
        </div >

    )
}

export default Checkout