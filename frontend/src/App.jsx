import { Route, Routes } from 'react-router'
import SignUp from './pages/Signup'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'

function App() {
  useGetCurrentUser()
  return (
    <Routes>
      <Route path='/sign-up' element={<SignUp />}></Route>
      <Route path='/sign-in' element={<SignIn />}></Route>
      <Route path='/forgot-password' element={<ForgotPassword />}></Route>
    </Routes>
  )
}

export default App