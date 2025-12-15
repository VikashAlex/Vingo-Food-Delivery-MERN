import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config();
const uploadonCloudinary = async (file) => {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLUDNAME,
        api_key: process.env.CLOUDINARY_APIKEY, //Apni Env file me se Leke Aao yah data
        api_secret: process.env.CLOUDINARY_APISECERT,
    });
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(file.path)
        fs.unlinkSync(file.path)
        return uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(file.path)
        console.log(error)
    }
}

export default uploadonCloudinary