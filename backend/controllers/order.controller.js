import orderModel from "../models/order.model.js"
import shopModel from "../models/shop.model.js"
import userModel from "../models/user.model.js"

export const placeOreder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "cart item empty" })
        }

        if (!deliveryAddress?.text || !deliveryAddress?.latitude || !deliveryAddress?.longitude) {
            return res.status(400).json({ success: false, message: "address is not complete." })
        }

        // 1️⃣ Group items by shop
        const groupItemByShop = {}

        for (const item of cartItems) {
            const shopId = item.shop
            if (!groupItemByShop[shopId]) {
                groupItemByShop[shopId] = []
            }
            groupItemByShop[shopId].push(item)
        }

        // 2️⃣ Create shop wise orders
        const shopOrders = await Promise.all(
            Object.keys(groupItemByShop).map(async (shopId) => {
                const shop = await shopModel.findById(shopId).populate('owner')
                if (!shop) {
                    throw new Error("Shop not found")
                }

                const items = groupItemByShop[shopId]

                const subTotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.qnty), 0)

                return {
                    shop: shop._id,
                    owner: shop.owner._id,
                    subTotal,
                    shopOrderItem: items.map((i) => ({
                        item: i.id,
                        name: i.itemName,
                        qnty: i.qnty,
                    })),
                }
            })
        )

        const newOrder = await orderModel.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })
        await newOrder.populate('shopOrders.shop', "shopName")
        await newOrder.populate('shopOrders.owner', "fullName email mobile")
        await newOrder.populate('shopOrders.shopOrderItem.item', "image itemName price")
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const getOrders = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)
        if (user.role === "user") {
            const Orders = await orderModel.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate('shopOrders.shop', 'shopName')
                .populate('shopOrders.owner', 'fullName email mobile')
                .populate('shopOrders.shopOrderItem.item', 'itemName image price')
            return res.status(200).json({ success: true, message: "Orders found.", Orders: Orders })
        }
        else if (user.role === "owner") {
            const Orders = await orderModel.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate('shopOrders.shop', "shopName")
                .populate('user')
                .populate('shopOrders.shopOrderItem.item', "itemName image price")
            const fillterOrder = Orders.map((order) => ({
                _id: order._id,
                user: order.user,
                deliveryAddress: order.deliveryAddress,
                paymentMethod: order.paymentMethod,
                totalAmount: order.totalAmount,
                shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
                createdAt: order.createdAt
            }))
            return res.status(200).json({ success: true, message: "Orders found.", Orders: fillterOrder })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const updateStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;
        const order = await orderModel.findById(orderId)
        if (!order) {
            return res.status(404).json({ success: false, message: "order not found." })
        }
        const shopOrder = order.shopOrders.find((o) => o.shop == shopId)
        shopOrder.status = status;
        await shopOrder.save()
        await order.save()
        return res.status(200).json({ success: true, message: " order status update." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

}