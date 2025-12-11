import mongoose from "mongoose"
const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`database is connected...`)
    } catch (error) {
        console.log('database error...')
    }
}

export default mongoDB;