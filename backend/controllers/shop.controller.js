import shopModel from "../models/shop.model.js"
import uploadonCloudinary from "../utils/cloudinary.js"

export const CreateEditShop = async (req, res) => {
    try {
        const { shopName, state, city, address } = req.body
        let image = null
        if (req.file) {
            image = await uploadonCloudinary(req.file)
        }
        let shop = await shopModel.findOne({ owner: req.userId });
        if (!shop) {
            shop = await shopModel.create({
                shopName, state, city, address, image, owner: req.userId,
            })
            await shop.populate("owner")
            return res.status(201).json({ success: true, message: "Shop Create Successfuly.", shop })
        } else {
            if (image) {
                shop = await shopModel.findByIdAndUpdate(shop._id, {
                    shopName, state, city, address, image, owner: req.userId,
                }, { new: true })
            } else {
                shop = await shopModel.findByIdAndUpdate(shop._id, {
                    shopName, state, city, address, owner: req.userId,
                }, { new: true })
            }
            await shop.populate("owner")
            return res.status(201).json({ success: true, message: "Shop Edit Successfuly.", shop })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Shop Create Error.", error })
    }
}
export const GetMyShop = async (req, res) => {
    try {
        const shop = await shopModel.findOne({ owner: req.userId }).populate('owner').populate('items');
        if (!shop) {
            return null
        }
        res.status(201).json({ success: true, message: "shop get", shop })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Shop get Error.", error })
    }
}
export const getShopInMyCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ success: false, message: "city not fond" })
        }
        const cityinMyCity = await shopModel.find({city})
        return res.status(201).json({ success: true, message: "get shopInmycity",cityinMyCity })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Shop get Error.", error })
    }
}
