import jwt from 'jsonwebtoken'
const genrateToken = async (useId) => {
    try {
        const token = await jwt.sign({ useId }, process.env.JWT_SECRECT, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.log(error)
    }
}

export default genrateToken