import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { formatINRCurrency } from "../utils/helper";
import { CiTrash } from "react-icons/ci";
import { qntyHandel, removeToCart } from "../redux/userSlice";
import { useEffect, useState } from "react";
function CartPage({ data }) {
    const navigate = useNavigate()
    const { cartItems } = useSelector((state) => state.user)
    const dispatcher = useDispatch()
    const [total, setTotal] = useState(0)
    useEffect(() => {
        setTotal(cartItems.reduce((acu, item) => acu += item.qnty * item.price, 0))
    }, [cartItems])
    return (
        <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
            {
                cartItems.length > 0
                    ?
                    <div className="w-full max-w-[800px]">
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="z-10 cursor-pointer"
                                onClick={() => navigate("/")}
                            >
                                <IoIosArrowRoundBack
                                    size={35}
                                    className="text-[#ff4d2d]"
                                />
                            </div>

                            <h1 className="text-2xl font-bold text-start">
                                Your Cart
                            </h1>
                        </div>

                        {
                            cartItems.map((data, index) => {
                                return <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl mb-3 shadow border">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={data?.image}
                                            alt=""
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />

                                        <div>
                                            <h1 className="font-medium text-gray-800">
                                                {data?.itemName}
                                            </h1>

                                            <p className="text-sm text-gray-500">
                                                ₹{data?.price} × {data?.qnty}
                                            </p>

                                            <p className="font-bold text-gray-900">
                                                {formatINRCurrency(data?.price * data?.qnty)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button onClick={() => dispatcher(qntyHandel({ type: "-", id: data.id }))} className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200">
                                            <FaMinus size={12} />
                                        </button>
                                        <span>{data.qnty}</span>
                                        <button onClick={() => dispatcher(qntyHandel({ type: "+", id: data.id }))} className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200">
                                            <FaPlus size={12} />
                                        </button>
                                        <button onClick={() => dispatcher(removeToCart(data.id))} className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200 text-red-600 font-bold">
                                            <CiTrash />
                                        </button>
                                    </div>


                                </div>
                            })
                        }
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl mb-3 shadow border">
                            <h1 className="font-medium text-gray-800">
                                Total Amount
                            </h1>

                            <p className="text-sm text-[#ff4d2d] font-bold">
                                {formatINRCurrency(total)}
                            </p>
                        </div>

                        <div className="flex items-center justify-end ">
                            <button onClick={() => navigate('/checkout')} className="text-white px-3 py-2 cursor-pointer rounded-xl font-bold bg-[#ff4d2d]">Proceed Checkout</button>
                        </div>



                    </div>
                    :
                    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border">

                            <div className="flex justify-center mb-4">
                                <div className="bg-[#ff4d2d] text-white p-5 rounded-full">
                                    <FaShoppingCart size={40} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Your cart is empty
                            </h2>

                            <p className="text-gray-500 mb-6">
                                Looks like you haven’t added anything to your cart yet.
                            </p>

                            <button
                                onClick={() => navigate("/")}
                                className="bg-[#ff4d2d] inline-flex gap-3 cursor-pointer items-center  text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
                            >
                                Browse Food <FaUtensils />
                            </button>

                        </div>
                    </div>
            }


        </div>




    )
}

export default CartPage