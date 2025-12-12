import { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router';
import { AxiosInstance } from '../utils/helper';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)



  const handelSendOtp = () => {
    AxiosInstance.post('/api/auth/send-otp', { email }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message)
        setTimeout(() => {
          setStep(2)
        }, 3000);
      }
    }).catch((err) => {
      toast.warning(err.response.data.message)
    })
  }
  const handelVerfiyOtp = () => {
    AxiosInstance.post('/api/auth/verify-otp', { email, otp }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message)
        setTimeout(() => {
          setStep(3)
        }, 3000);
      }
    }).catch((err) => {
      toast.warning(err.response.data.message)
    })
  }
  const handelresetPassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      return toast.warning("password must be same.")
    }
    AxiosInstance.post('/api/auth/reset-password', { email, password: password.confirmPassword }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message)
        setTimeout(() => {
          navigate('/sign-in')
        }, 3000);
      }
    }).catch((err) => {
      toast.warning(err.response.data.message)
    })
  }
  return (
    <section className='flex items-center justify-center p-4 min-h-screen bg-[#fff9f6]'>
      <div className='p-8 bg-white shadow-lg rounded-lg w-full max-w-md'>
        <div className='flex mb-6  items-center'>
          <IoArrowBack onClick={() => navigate('/sign-in')} size={30} color='#ff4d2d' className='cursor-pointer' />
          <h1 className='flex-1 text-xl text-center text-[#ff4d2d] font-medium'>Forgot Password</h1>
        </div>

        {
          step == 1 &&
          <div className='mb-4'>
            <div className='mb-4'>
              <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id='email' className='w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email' />
            </div>
            <button onClick={handelSendOtp} className='mb-4 w-full font-semibold bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer text-white  py-2 rounded-lg border transition duration-200'>Send OTP</button>
          </div>
        }

        {
          step == 2 &&
          <div className='mb-4'>
            <div className='mb-4'>
              <label htmlFor="enterOTP" className='block text-gray-700 font-medium mb-1'>OTP</label>
              <input onChange={(e) => setOtp(e.target.value)} value={otp} type="email" id='enterOTP' className='w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your OTP' />
            </div>
            <button onClick={handelVerfiyOtp} className='mb-4 w-full font-semibold bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer text-white  py-2 rounded-lg border transition duration-200'>Verify OTP</button>
          </div>
        }

        {
          step == 3 &&
          <div className='mb-4'>
            <div className='mb-4'>
              <label htmlFor="NewPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
              <div className='relative'>
                <input onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} value={password.newPassword} id='NewPassword' type={showNewPassword ? "text" : "password"} className='w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter New Password' />
                <button onClick={() => setShowNewPassword(prev => !prev)} className='absolute top-[50%] -translate-y-[50%] right-5 cursor-pointer'>
                  {
                    showNewPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />
                  }
                </button>
              </div>
            </div>
            <div className='mb-4'>
              <label htmlFor="confirmpass" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
              <div className='relative'>
                <input onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} value={password.confirmPassword} id='confirmpass' type={showConfirmPassword ? "text" : "password"} className='w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Confirm Password' />
                <button onClick={() => setShowConfirmPassword(prev => !prev)} className='absolute top-[50%] -translate-y-[50%] right-5 cursor-pointer'>
                  {
                    showConfirmPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />
                  }
                </button>
              </div>
            </div>
            <button onClick={handelresetPassword} className='mb-4 w-full font-semibold bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer text-white  py-2 rounded-lg border transition duration-200'>Reset Password</button>
          </div>
        }
      </div>
    </section>
  )
}

export default ForgotPassword