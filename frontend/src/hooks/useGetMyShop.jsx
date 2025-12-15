import  { useEffect } from 'react'
import { AxiosInstance } from '../utils/helper.js'
import { useDispatch, useSelector } from 'react-redux'
import { setShopData } from '../redux/ownerSlice.js'

function useGetMyShop() {
    const dispatcher = useDispatch()
    const { userData } = useSelector((state) => state.user)
    useEffect(() => {
        AxiosInstance.get('/api/shop/getmy-shop').then((res) => {
            if(res.data.success){
                dispatcher(setShopData(res.data.shop))
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [userData])
}

export default useGetMyShop