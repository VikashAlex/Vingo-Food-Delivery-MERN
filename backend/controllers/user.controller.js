import userModel from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId= req.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId not found." })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found." })
        }
        return res.status(201).json({ success: true, message: "user is found.", user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "get user error." })
    }
}