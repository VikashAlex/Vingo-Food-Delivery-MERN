import { useState } from "react"
import { AxiosInstance } from "../utils/helper"
import Header from "./Header"
function UserDashboard() {
    const [file, setFile] = useState('')
    const sumbitHandel = () => {
        const data = {
            shopName: "vikash", state: "rajasthan", city: "alwar", address: "jaipur", image: file
        }
        AxiosInstance.post('/api/shop/create-edit', data).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <main className='w-screen min-h-screen flex justify-center items-center flex-col bg-[#fff9f6]'>
            <Header />
        </main>
    )
}

export default UserDashboard