import itemModel from "../models/item.model.js";
import shopModel from "../models/shop.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";

export const itemInsert = async (req, res) => {
    try {
        const { itemName, category, foodType, price } = req.body
        let image = null;
        if (req.file) {
            image = await uploadonCloudinary(req.file.path)
        }
        const shop = await shopModel.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(400).json({ success: false, message: "Shop Not Found." })
        }
        const item = await itemModel.create({
            itemName, category, foodType, price, image, shop: shop._id
        })
        return res.status(201).json({ success: true, message: "Item Create Successfuly.", item })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Item Create Error.", error })
    }
}
export const itemEdit = async (req, res) => {
    try {
        const { itemId } = req.pramas
        const { itemName, category, foodType, price } = req.body
        let image = null;
        if (req.file) {
            image = await uploadonCloudinary(req.file.path)
        }
        const item = await itemModel.findByIdAndUpdate(itemId, { itemName, category, foodType, price, image }, { new: true });
        if (!item) {
            return res.status(400).json({ success: false, message: "item Not Found." })
        }
        return res.status(201).json({ success: true, message: "Item edit Successfuly.", item })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Item edit Error.", error })
    }
}