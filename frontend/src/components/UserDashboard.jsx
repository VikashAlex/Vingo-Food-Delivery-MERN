
import Header from "./Header"
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { categories } from "../utils/categoreis.js"
import CategoryCard from "./CategoryCard.jsx"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import ShopCard from "./ShopCard.jsx"
import ItemCard from "./ItemCard.jsx"
import NoFoodFound from "./NoFoodFound.jsx"
import { motion, AnimatePresence } from "framer-motion";
import { containerVariant, itemVariant } from "../utils/animations.js"
function UserDashboard() {
    const currentScrollRef = useRef()
    const currentShopScrollRef = useRef()
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(false)
    const [showShopLeftButton, setShowShopLeftButton] = useState(false)
    const [showShopRightButton, setShowShopRightButton] = useState(false)
    const [updatedList, setUpdatedList] = useState([])
    const { cityData } = useSelector((state) => state.user)
    const { myCityShop, itemData, searchItem } = useSelector((state) => state.user)
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

    const updateItemList = (category) => {
        if (category === "All") {
            setUpdatedList(itemData)
        } else {
            let updatedArry = itemData.filter((item) => item.category === category)
            setUpdatedList(updatedArry)
        }
    }

    useEffect(() => {
        setUpdatedList(itemData)
    }, [itemData])

    return (
        <main className='w-full min-h-screen  flex justify-center items-center flex-col bg-[#fff9f6]'>
            <Header />

            {
                searchItem && (
                    <AnimatePresence>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={containerVariant}
                            className="w-full max-w-6xl  min-h-[300px] fixed top-20 left-[50%] 
        rounded-2xl py-5 -translate-x-[50%] z-50 flex flex-col gap-5 items-start p-2.5 bg-white/90 backdrop-blur-md"
                        >
                            <h1 className="text-gray-800 text-sm sm:text-3xl">
                                Search Food Items
                            </h1>

                            {searchItem.length > 0 ? (
                                <motion.div
                                    variants={containerVariant}
                                    className="w-full flex flex-wrap justify-center md:justify-start 
            overflow-x-hidden gap-5 pb-2"
                                    ref={currentShopScrollRef}
                                >
                                    {searchItem.map((item, index) => (
                                        <motion.div key={index} variants={itemVariant}>
                                            <ItemCard item={item} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full h-full flex justify-center items-center"
                                >
                                    <NoFoodFound />
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )
            }


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
                            <CategoryCard onClick={updateItemList} data={cate} key={index} />
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
                        {myCityShop?.map((shop, index) => (
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

                    <div className="w-full flex flex-wrap justify-center md:justify-items-start  overflow-x-hidden gap-5 pb-2  scroll-smooth" ref={currentShopScrollRef}>
                        {updatedList?.map((item, index) => (
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