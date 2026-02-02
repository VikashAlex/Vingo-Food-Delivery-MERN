import { useEffect } from 'react'
import { AxiosInstance } from '../utils/helper.js'
import { useDispatch, useSelector } from 'react-redux'
import { setDeliverBoyOrders } from '../redux/userSlice.js'

function useGetBoyMyOrders() {
    const { myOrders } = useSelector((state) => state.user)
    const dispatcher = useDispatch()
    useEffect(() => {
        if (myOrders.length == 0) {
            AxiosInstance.get('/api/order/get-deliveryBoy-orders').then((res) => {
                if (res.data.success) {
                    dispatcher(setDeliverBoyOrders(res.data.orders))
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [])
}




export default useGetBoyMyOrders