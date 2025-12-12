import { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router';
import { AxiosInstance } from '../utils/helper.js';
import { toast } from 'react-toastify';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebase.js';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatcher  = useDispatch()
  const [forminfo, setForminfo] = useState({
    email: "",
    password: ""
  })

  const sumbitHandel = () => {
    AxiosInstance.post('/api/auth/signin', forminfo).then((res) => {
      if (res.data.success) {
        dispatcher(setUserData(res.data.user))
        toast.success(res.data.message);
        setForminfo({
          email: "",
          password: "",
        })
      }
    }).catch((error) => {
      toast.warning(error.response.data.message);
    })
  }

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider)
    AxiosInstance.post('/api/auth/signin-google', {
      email: result.user.email,
    }).then((res) => {
      if (res.data.success) {
        dispatcher(setUserData(res.data.user))
        toast.success(res.data.message);
      }
    }).catch((error) => {
      console.log(error)
      toast.warning(error.response.data.message);
    })
  }
  return (
    <section className={`text-sm flex justify-center items-center p-4 bg-[#fff9f6]`}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#ddd]`}>
        <h1 className={`text-3xl font-bold mb-2 text-[#ff4d2d]`}>Vingo</h1>
        <p className='text-gray-600 mb-8'>Sign In your account to get started with delicions food deliveries</p>
        {/* email Input */}
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
          <input onChange={(e) => setForminfo({ ...forminfo, email: e.target.value })} value={forminfo.email} type="email" id='email' className='w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Email' />
        </div>

        {/* Password Input */}
        <div className='mb-4'>
          <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
          <div className='relative'>
            <input onChange={(e) => setForminfo({ ...forminfo, password: e.target.value })} value={forminfo.password} id='password' type={showPassword ? "text" : "password"} className='w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Your Password' />
            <button onClick={() => setShowPassword(prev => !prev)} className='absolute top-[50%] -translate-y-[50%] right-5 cursor-pointer'>
              {
                showPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />
              }
            </button>
          </div>

          <div className='text-right text-[#ff4d2d] mt-4  font-medium'>
            <Link to={'/forgot-password'}>Forgot Password ?</Link>
          </div>
        </div>

        {/* Sign In Btn */}
        <button onClick={sumbitHandel} className='mb-4 w-full font-semibold bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer text-white  py-2 rounded-lg border transition duration-200'>Sign In</button>
        {/* Sign In with Google */}
        <button onClick={handleGoogle} className='mb-6 w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg transition duration-200 border border-[#ddd] hover:bg-gray-200 cursor-pointer'>
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>
        {/* Already Account */}
        <p className='text-center'> Want to create a new account ? <Link to={'/sign-up'}> <span className='cursor-pointer text-[#ff4d2d]'>Sign up</span> </Link></p>
      </div>
    </section >
  )
}

export default SignIn