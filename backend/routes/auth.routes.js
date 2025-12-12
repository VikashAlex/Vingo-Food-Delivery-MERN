import express from 'express';
import { resetOtp, resetPassword, signIn, signinWithGoogle, signOut, signup, signupWithGoogle, verifyOtp } from '../controllers/auth.controller.js';
const authRoutes = express.Router();

authRoutes.post('/signup', signup)
authRoutes.post('/signin', signIn)
authRoutes.get('/signout', signOut)
authRoutes.post('/send-otp', resetOtp)
authRoutes.post('/verify-Otp', verifyOtp)
authRoutes.post('/reset-password', resetPassword)
authRoutes.post('/signup-google', signupWithGoogle)
authRoutes.post('/signin-google', signinWithGoogle)

export default authRoutes