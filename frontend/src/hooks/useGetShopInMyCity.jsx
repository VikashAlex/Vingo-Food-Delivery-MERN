import { useEffect } from 'react'
import { AxiosInstance } from '../utils/helper.js'
import { useDispatch, useSelector } from 'react-redux'
import { setItemData, setMyCityShop } from '../redux/userSlice.js'

function useGetShopInMyCity() {
    const dispatcher = useDispatch()
    const { cityData } = useSelector((state) => state.user)
    useEffect(() => {
        if (cityData) {
            AxiosInstance.get(`/api/shop/getshop-mycity/${cityData?.city}`).then((res) => {
                if (res.data.success) {
                    dispatcher(setMyCityShop(res.data.cityinMyCity))
                }
            }).catch((err) => {
                console.log(err)
            })

            AxiosInstance.get(`/api/item/getItem-Incity/${cityData?.city}`).then((res) => {
                if (res.data.success) {
                    dispatcher(setItemData(res.data.items))
                }

            }).catch((err) => {
                console.log(err)
            })
        }
    }, [cityData])
}

export default useGetShopInMyCity