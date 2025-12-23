import { FaCircleCheck } from "react-icons/fa6"
import { useNavigate } from "react-router"

function OrderPlace() {
    const navigate = useNavigate()
    return (
        <main className="min-h-screen flex flex-col px-4 justify-center items-center overflow-hidden bg-[#fff9f6] text-center relative">
            <FaCircleCheck className="text-green-500 text-6xl mb-4" />

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Order Placed!
            </h1>

            <p className="text-gray-600 max-w-md mb-6">
                Thank you for your purchase. Your order is being prepared.
                You can track your order status in the "My Orders" section.
            </p>

            <button onClick={()=>navigate('/my-orders')} className="bg-[#ff4d2d] cursor-pointer hover:bg-[#e64528] text-white px-6 py-2 rounded-lg text-sm font-medium transition">
                Back to my orders
            </button>
        </main>
    )
}

export default OrderPlace