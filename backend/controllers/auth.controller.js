import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import genrateToken from "../utils/token.js";
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
        return res.status(201).json({ success: true, message: "Sign-up Successfully.", token })
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
        const isMatch = await bcrypt.compare(password, user.password)
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
        return res.status(201).json({ success: true, message: "Sign-In Successfully.", token })
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