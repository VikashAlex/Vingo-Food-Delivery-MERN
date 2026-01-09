import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AxiosInstance } from '../utils/helper'
import { FaLocationDot, FaStore, FaUtensils } from 'react-icons/fa6'
import ItemCard from '../components/ItemCard'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { RingLoader } from 'react-spinners'

function Shop() {
    const { shopId } = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState([])
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const getItemsInShop = () => {
        AxiosInstance.get(`/api/item/getItem-InShop/${shopId}`).then((res) => {
            if (res.data.success) {
                setShop(res.data.shop)
                setItems(res.data.items)
                setLoader(false)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
        getItemsInShop()
    }, [shopId])
    return (
        <div className="min-h-screen bg-gray-50">
            {
                loader ?
                    <div className='fixed  w-full h-full flex justify-center items-center '>
                        <RingLoader
                            color="#ff4d2d"
                            size={200}
                        />
                    </div>
                    :
                    <>
                        <button onClick={() => navigate('/')} className="absolute cursor-pointer top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow-lg transition">
                            <IoIosArrowRoundBack size={35} className="text-white" />
                        </button>

                        {shop && (
                            <div className="relative w-full h-64 md:h-80 lg:h-96">
                                <img
                                    src={shop.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-linear-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
                                    <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />

                                    <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                                        {shop.shopName}
                                    </h1>

                                    <div className="flex items-center gap-2.5">
                                        <FaLocationDot size={22} color="red" />
                                        <p className="text-lg font-medium text-gray-200 mt-2.5">
                                            {shop.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="max-w-7xl mx-auto px-6 py-10">
                            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800">
                                <FaUtensils color="red" /> Our Menu
                            </h2>

                            {items.length > 0 ? (
                                <div className="flex flex-wrap justify-center gap-8">
                                    {items.map((item) => (
                                        <ItemCard item={item} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-lg">
                                    No Items Available
                                </p>
                            )}
                        </div>
                    </>
            }

        </div>

    )
}

export default Shop