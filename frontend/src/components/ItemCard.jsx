import { useState } from "react"
import { FaDrumstickBite, FaLeaf, FaMinus, FaPlus, FaRegStar, FaShoppingCart } from "react-icons/fa"
import { FaStar } from "react-icons/fa";
import { formatINRCurrency } from "../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
function ItemCard({ item }) {
    const [qnty, setQnty] = useState(0)
    const { cartItems } = useSelector((state) => state.user)
    const dispatcher = useDispatch()
    const cardRatting = (ratting) => {
        let star = []
        for (let i = 1; i <= 5; i++) {
            star.push(
                i <= ratting ? <FaStar color="#ff4d2d" size={15} /> : <FaRegStar size={15} />
            )
        }
        return star
    }
    const qntyhandel = (type) => {
        let newQnty = null
        type == "+" ? newQnty = qnty + 1 : newQnty = qnty - 1
        if (newQnty >= 0) {
            setQnty(newQnty)
        }
    }

    return (

        <div className="md:w-[250px] w-full rounded-2xl border-2  border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
                <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
                    {item.foodType === "veg" ? (
                        <FaLeaf className="text-green-600 text-lg" />
                    ) : (
                        <FaDrumstickBite className="text-red-600 text-lg" />
                    )}
                </div>
                <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            <div className="flex-1 flex flex-col p-4">
                <h1 className="font-semibold text-base text-gray-900 truncate">{item.itemName}</h1>
                {
                    <div className="flex items-center gap-1  mt-1">
                        {cardRatting(item.ratting?.average || 0)}
                        <span className="text-gray-500 text-xs">{item.ratting?.count || 0}</span>
                    </div>
                }
            </div>

            <div className=" md:flex items-center justify-between mt-auto  p-3 gap-4">
                <span className="font-bold text-gray-900 text-lg md:inline block">
                    {formatINRCurrency(item.price || 0)}
                </span>

                <div className="inline-flex md:flex items-center md:mt-0 mt-2 border rounded-full overflow-hidden shadow-sm">
                    <button onClick={() => qntyhandel("-")} className="px-2 py-1 hover:bg-gray-100 transition">
                        <FaMinus size={12} />
                    </button>

                    <span className="text-sm">{qnty}</span>

                    <button onClick={() => qntyhandel("+")} className="px-2 py-1 hover:bg-gray-100 transition">
                        <FaPlus size={12} />
                    </button>

                    <div onClick={() => {
                        qnty > 0 && dispatcher(addToCart({
                            id: item._id,
                            itemName: item.itemName,
                            shop: item.shop,
                            price: item.price,
                            qnty,
                            image: item.image,
                            foodType: item.foodType,
                        }))
                    }
                    }
                        className={`${cartItems.some((i) => i.id == item._id) ? "bg-gray-800" : "bg-[#ff4d2d]"} text-white px-3  py-2 flex justify-center items-center`}>
                        <FaShoppingCart />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ItemCard