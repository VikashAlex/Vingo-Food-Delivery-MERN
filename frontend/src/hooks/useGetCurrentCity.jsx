import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCityData } from '../redux/userSlice.js'
import axios from 'axios'

function useGetCurrentCity() {
    const dispatcher = useDispatch()
    const { userData } = useSelector((state) => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIKEY
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { longitude, latitude } = position.coords
            axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`).then((res) => {
                if (res.data) {
                    dispatcher(setCityData(res.data.results[0]))
                }
            }).catch((err) => {
                console.log(err)
            })
        })
    }, [userData])
}

export default useGetCurrentCity