import { useEffect } from 'react'
import { AxiosInstance } from '../utils/helper.js'
import { useDispatch } from 'react-redux'
import { setOrders, setUserData } from '../redux/userSlice.js'

function useGetMyOrders() {
    const dispatcher = useDispatch()
    useEffect(() => {
        AxiosInstance.get('/api/order/get-orders').then((res) => {
            if (res.data.success) {
                dispatcher(setOrders(res.data.Orders))
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])
}

export default useGetMyOrders