import React, { useEffect } from 'react'
import { AxiosInstance } from '../utils/helper.js'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

function useGetCurrentUser() {
    const dispatcher = useDispatch()
    useEffect(() => {
        AxiosInstance.get('/api/user/current').then((res) => {
            if(res.data.success){
                dispatcher(setUserData(res.data.user))
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])
}

export default useGetCurrentUser