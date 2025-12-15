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
        } else {
            shop = await shopModel.findByIdAndUpdate(shop._id, {
                shopName, state, city, address, image, owner: req.userId,
            }, { new: true })
        }
        await shop.populate("owner")
        return res.status(201).json({ success: true, message: "Shop Create Successfuly.", shop })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Shop Create Error.", error })
    }
}
export const GetMyShop = async (req, res) => {
    try {
        const shop = await shopModel.findOne({ owner: req.userId }).populate('owner items');
        if (!shop) {
            return res.status(201).json({ success: false, message: "shop not found" })
        }
        res.status(201).json({ success: true, message: "shop get", shop })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Shop get Error.", error })
    }
}

