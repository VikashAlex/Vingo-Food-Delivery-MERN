
import { IoIosArrowRoundBack } from 'react-icons/io'
import { TbCurrentLocation } from 'react-icons/tb'
import { IoLocationSharp, IoSearchOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router'
import "leaflet/dist/leaflet.css";
import { BounceLoader } from 'react-spinners'
import { setAddress, setPosition } from '../redux/mapSlice'
import axios from 'axios'
import { useEffect, useState } from 'react'

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
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { longitude, latitude } = position.coords
            axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`).then((res) => {
                if (res.data) {
                    dispatcher(setAddress(res.data.results[0]))
                    dispatcher(setPosition({ long: longitude, lati: latitude }))
                }
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    const getLocationText = () => {
        console.log(inputValue)
        axios.get(`https://api.geoapify.com/v1/geocode/search?${inputValue}=11%20Av.%20de%20la%20Bourdonnais%2C%2075007%20Paris%2C%20France&format=json&apiKey=${apiKey}`).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }


    useEffect(() => {
        setInputValue(address?.formatted)
    }, [address])




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
                            onChange={(e) => setInputValue(e.target.value)}
                        />

                        <button onClick={() => getLocationText()} className="bg-[#ff4d2d] hover:bg-[#e64528] text-white px-3 py-2 rounded-lg flex items-center justify-center">
                            <IoSearchOutline size={17} />
                        </button>

                        <button onClick={() => goToCurrentAddress()} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
                            <TbCurrentLocation size={17} />
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
            </div>
        </div>

    )
}

export default Checkout