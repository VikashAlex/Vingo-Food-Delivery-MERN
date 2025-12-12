import { useState } from "react"
import { AxiosInstance } from "../utils/helper"

function UserDashboard() {
    const [file,setFile]=useState('')
console.log(file)
    const sumbitHandel = () => {
        const data = {
            shopName:"vikash",state:"rajasthan",city:"alwar",address:"jaipur",image:file
        }
        AxiosInstance.post('/api/shop/create-edit',data).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div>UserDashboard
            <input type="file" placeholder="select file" onChange={(e)=>setFile(e.target.files)}  />
            <button onClick={sumbitHandel}>shopcreate</button>
        </div>
    )
}

export default UserDashboard