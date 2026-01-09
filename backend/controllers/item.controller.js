import itemModel from "../models/item.model.js";
import shopModel from "../models/shop.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";

export const itemInsert = async (req, res) => {
    try {
        const { itemName, category, foodType, price } = req.body
        let image = null;
        if (req.file) {
            image = await uploadonCloudinary(req.file)
        }
        const shop = await shopModel.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(400).json({ success: false, message: "Shop Not Found." })
        }
        const item = await itemModel.create({
            itemName, category, foodType, price, image, shop: shop._id
        })
        await shop.items.push(item._id);
        await shop.populate('owner items')
        await shop.save()
        return res.status(201).json({ success: true, message: "Item Create Successfuly.", item, shop })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Item Create Error.", error })
    }
}
export const itemEdit = async (req, res) => {
    try {
        const { itemId } = req.params
        const { itemName, category, foodType, price } = req.body
        let image = null;
        let item = await itemModel.findById(itemId)
        const shop = await shopModel.findOne({ owner: req.userId });
        if (!item) {
            return res.status(400).json({ success: false, message: "item Not Found." })
        }
        if (req.file) {
            image = await uploadonCloudinary(req.file)
        }
        image = item.image
        if (!shop) {
            return res.status(400).json({ success: false, message: "Shop Not Found." })
        }
        item = await itemModel.findByIdAndUpdate(itemId, { itemName, category, foodType, price, image }, { new: true });
        await shop.populate('owner items')
        await shop.save()
        return res.status(201).json({ success: true, message: "Item edit Successfuly.", item, shop })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Item edit Error.", error })
    }
}
export const getItem = async (req, res) => {
    try {
        const { itemId } = req.params
        const item = await itemModel.findById(itemId)
        if (!item) {
            return res.status(400).json({ success: false, message: "item Not Found." })
        }
        return res.status(201).json({ success: true, message: "Item get Successfuly.", item })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Item get Error.", error })
    }
}
export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item Id Not Provided." });
        }
        const item = await itemModel.findByIdAndDelete(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item Not Found." });
        }

        const shop = await shopModel.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(400).json({ success: false, message: "Shop Not Found." })
        }


        await shopModel.updateOne(
            { _id: item.shop },
            { $pull: { items: item._id } },
            { new: true }
        );

        await shop.populate('owner items')
        await shop.save()


        return res.status(200).json({ success: true, message: "Item Deleted Successfully.", shop });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Item Delete Error.", error });
    }

}

export const getItemInCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ success: false, message: "city Not Found." })
        }

        const shop = await shopModel.find({ city: city })
        if (!shop) {
            return res.status(400).json({ success: false, message: "shop Not Found." })
        }
        const shopId = shop.map((shop) => shop._id);

        const items = await itemModel.find({
            shop: { $in: shopId }
        });

        return res.status(201).json({ success: true, message: "Item get Successfuly.", items })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Item get Error.", error })
    }
}

export const getItemInShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const shop = await shopModel.findById(shopId).populate('items')
        if (!shop) {
            return res.status(400).json({ success: false, message: "shop Not Found." })
        }
        return res.status(201).json({ success: true, message: "Item get Successfuly.", shop, items: shop.items })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Shop Item get Error.", error })
    }

}

export const searchItems = async (req, res) => {
    try {
        const { query, city } = req.query;
        if (!query || !city) {
            return null
        }
        const shop = await shopModel.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')
        if (!shop) {
            return res.status(400).json({ success: false, message: "shop Not Found." })
        }
        const shopId = shop.map((shop) => shop._id);

        const items = await itemModel.find({
            shop: { $in: shopId },
            $or: [
                { itemName: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        })

        return res.status(200).json({ success: true, message: "Item Seacrh Successfuly.", items })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Search Item  Error.", error })
    }

}