import jwt from 'jsonwebtoken'
const genrateToken = async (userId) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRECT, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.log(error)
    }
}

export default genrateToken