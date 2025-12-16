
import Header from "./Header"
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { categories } from "../utils/categoreis.js"
import CategoryCard from "./CategoryCard.jsx"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import ShopCard from "./ShopCard.jsx"
import ItemCard from "./ItemCard.jsx"
function UserDashboard() {
    const currentScrollRef = useRef()
    const currentShopScrollRef = useRef()
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(false)
    const [showShopLeftButton, setShowShopLeftButton] = useState(false)
    const [showShopRightButton, setShowShopRightButton] = useState(false)

    const { cityData } = useSelector((state) => state.user)
    const { myCityShop, itemData } = useSelector((state) => state.user)
    const scrollHandel = (ref, direcation) => {
        ref.current.scrollBy({
            left: direcation === "left" ? -200 : 200,
            behavior: "smooth",
        })
    }
    const updateButton = (ref, setleftBtn, setRightBtn) => {
        const element = ref.current
        if (element) {
            setleftBtn(element.scrollLeft > 0)
            setRightBtn(element.scrollLeft + element.clientWidth < element.scrollWidth)
        }
    }
    useEffect(() => {

        if (currentScrollRef.current) {
            updateButton(currentScrollRef, setShowLeftButton, setShowRightButton)
            currentScrollRef.current.addEventListener('scroll', () => {
                updateButton(currentScrollRef, setShowLeftButton, setShowRightButton)
            })
        }
        if (currentShopScrollRef.current) {
            updateButton(currentShopScrollRef, setShowShopLeftButton, setShowShopRightButton)
            currentShopScrollRef.current.addEventListener('scroll', () => {
                updateButton(currentShopScrollRef, setShowShopLeftButton, setShowShopRightButton)
            })
        }
        return () => {
            {
                currentScrollRef.current?.removeEventListener('scroll', () => {
                    updateButton(currentScrollRef, setShowLeftButton, setShowRightButton)
                }),
                    currentShopScrollRef.current?.removeEventListener('scroll', () => {
                        updateButton(currentShopScrollRef, setShowShopLeftButton, setShowShopRightButton)
                    })
            }
        };
    }, [categories])


    return (
        <main className='w-full min-h-screen  flex justify-center items-center flex-col bg-[#fff9f6]'>
            <Header />
            <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5 mt-20 ">
                <h1 className="text-gray-800 text-2xl sm:text-3xl">
                    Inspiration for your first order
                </h1>
                <div className="w-full relative">
                    {showLeftButton &&
                        <button onClick={() => scrollHandel(currentScrollRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                            <FaCircleChevronLeft />
                        </button>
                    }

                    <div className="w-full flex overflow-x-hidden gap-4 pb-2  scroll-smooth" ref={currentScrollRef}>
                        {categories.map((cate, index) => (
                            <CategoryCard data={cate} key={index} />
                        ))}
                    </div>

                    {showRightButton && <button onClick={() => scrollHandel(currentScrollRef, "right")} className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                        <FaCircleChevronRight />
                    </button>}

                </div>
            </div>

            {/* shops in my city */}
            <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5 ">
                <h1 className="text-gray-800 text-2xl sm:text-3xl">
                    Best Shop in <span className="text-[#ff4d2d] font-medium">{cityData?.city}</span>
                </h1>
                <div className="w-full relative">
                    {showShopLeftButton &&
                        <button onClick={() => scrollHandel(currentShopScrollRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                            <FaCircleChevronLeft />
                        </button>
                    }

                    <div className="w-full flex overflow-x-hidden gap-4 pb-2  scroll-smooth" ref={currentShopScrollRef}>
                        {myCityShop.map((shop, index) => (
                            <ShopCard shop={shop} key={index} />
                        ))}
                    </div>

                    {showShopRightButton && <button onClick={() => scrollHandel(currentShopScrollRef, "right")} className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                        <FaCircleChevronRight />
                    </button>}

                </div>
            </div>

            {/* items in my city */}
            <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5 ">
                <h1 className="text-gray-800 text-2xl sm:text-3xl">
                    Suggested Food Items 
                </h1>
                <div className="w-full relative">
                    {showShopLeftButton &&
                        <button onClick={() => scrollHandel(currentShopScrollRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                            <FaCircleChevronLeft />
                        </button>
                    }

                    <div className="w-full flex overflow-x-hidden gap-4 pb-2  scroll-smooth" ref={currentShopScrollRef}>
                        {itemData.map((item, index) => (
                            <ItemCard item={item} key={index} />
                        ))}
                    </div>

                    {showShopRightButton && <button onClick={() => scrollHandel(currentShopScrollRef, "right")} className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                        <FaCircleChevronRight />
                    </button>}

                </div>
            </div>

          
        </main >
    )
}

export default UserDashboard