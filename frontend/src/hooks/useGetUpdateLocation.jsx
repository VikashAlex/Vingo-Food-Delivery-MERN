import { useEffect } from 'react'
import { AxiosInstance } from '../utils/helper.js'
import { useSelector } from 'react-redux'
function useGetUpdateLocation() {
    const { userData } = useSelector((state) => state.user)
    useEffect(() => {
        const updateLocation = (long, lati) => {
            AxiosInstance.post('/api/user/update-location', { long, lati }).then((res) => {
            }).catch((err) => {
                console.log(err)
            })
        }
        navigator.geolocation.watchPosition(async (position) => {
            const { longitude, latitude } = position.coords
                updateLocation(longitude, latitude)
        })
    }, [userData])
}

export default useGetUpdateLocation