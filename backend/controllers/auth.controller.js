import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import genrateToken from "../utils/token.js";
import otpGenerator from 'otp-generator'
import { SendEmail } from "../utils/email.js";
export const signup = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;
        const existuser = await userModel.findOne({ email });
        if (existuser) {
            return res.status(400).json({ success: false, message: "User already exist." })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ success: false, message: "mobile no must be at least 10 digits." })
        }
        const hashPasword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            fullName,
            email,
            mobile,
            role,
            password: hashPasword
        })
        user.save()
        const token = await genrateToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json({ success: true, message: "Sign-up Successfully.", token,user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Sign-up Error.", error })
    }
}
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email password must..." })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does't exist." })
        }
        const userPassword = await user.password || null;
        if (!userPassword) {
            return res.status(400).json({ success: false, message: "password incorrect." })
        }
        const isMatch = await bcrypt.compare(password, userPassword)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "password incorrect." })
        }
        const token = await genrateToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json({ success: true, message: "Sign-In Successfully.", token,user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Sign-In Error.", error })
    }
}
export const signOut = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(201).json({ success: true, message: "Sign-Out Successfully." });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Sign-Out Error.", error });
    }
}
export const resetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does't exist." })
        }
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
        user.resetOtp = otp;
        user.isOtpVerified = false;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();
        SendEmail(email, otp)
        return res.status(201).json({ success: true, message: "Otp Send Successfully." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Otp Send Error.", error })
    }
}
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "invalid User." })
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Otp is Expire." })
        }
        if (user.resetOtp != otp) {
            return res.status(400).json({ success: false, message: "Otp is invalid." })
        }
        user.resetOtp = undefined
        user.otpExpires = undefined
        user.isOtpVerified = true
        await user.save();
        return res.status(201).json({ success: true, message: "Otp is Verify Successfully." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Otp Verify Error.", error })
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ success: false, message: "Verification is required." })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." })
        }
        const hashPasword = await bcrypt.hash(password, 10)
        user.password = hashPasword
        user.isOtpVerified = false
        await user.save();
        return res.status(201).json({ success: true, message: "Password Reset Successfully." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Password Reset Error.", error })
    }
}
export const signupWithGoogle = async (req, res) => {
    try {
        const { fullName, email, mobile, role } = req.body;
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already registerd." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ success: false, message: "mobile no must be at least 10 digits." })
        }
        user = await userModel.create({
            fullName,
            email,
            mobile,
            role,
        })
        user.save()
        const token = await genrateToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json({ success: true, message: "Sign-up Successfully.", token,user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Sign-up Error.", error })
    }
}
export const signinWithGoogle = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User does't exist." })
        }
        const token = await genrateToken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json({ success: true, message: "Sign-In Successfully.", token,user })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Sign-In Error.", error })
    }
}