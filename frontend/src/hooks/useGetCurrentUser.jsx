import React, { useEffect } from 'react'
import { AxiosInstance } from '../utils/helper.js'

function useGetCurrentUser() {
    useEffect(() => {
        AxiosInstance.get('/api/user/current').then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
}

export default useGetCurrentUser