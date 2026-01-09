import assignmentModel from "../models/assignment.model.js"
import orderModel from "../models/order.model.js"
import shopModel from "../models/shop.model.js"
import userModel from "../models/user.model.js"
import { SendDeliveryEmail } from "../utils/email.js"
import otpGenerator from 'otp-generator'

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
                .populate('shopOrders.assignedDeliveryBoy', "fullName mobile")
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
        let deliveryBoysPayload = []
        if (status == "out of delivery" && !shopOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress
            const nearByDeliveryBoy = await userModel.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 5000
                    }
                }
            })
            const nearByIds = nearByDeliveryBoy.map(b => b._id)
            const busyIds = await assignmentModel.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["brodcasted", "compeleted",] }
            }).distinct('assignedTo')

            const busyIdSet = new Set(busyIds.map(id => String(id)))

            const availableBoys = nearByDeliveryBoy.filter(b => !busyIdSet.has(String(b._id)))
            const candidates = availableBoys.map(b => b._id)
            if (candidates.length === 0) {
                await order.save()
                return res.status(200).json({ success: true, message: " order status update. but no availabDelivery Boy at this time" })
            }

            const deliveryAssignment = await assignmentModel.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                brodcastedTo: candidates,
                status: "brodcasted"
            })
            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
            shopOrder.assignment = deliveryAssignment._id
            deliveryBoysPayload = availableBoys.map(b => ({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobile: b.mobile
            }))
        }

        await shopOrder.save()
        await order.save()
        const updateOrder = order.shopOrders.find(o => o.shop == shopId)
        await order.populate('shopOrders.shop', 'shopName')
        await order.populate('shopOrders.assignedDeliveryBoy', 'fullName email mobile')
        return res.status(200).json({
            success: true, message: " order status update.",
            shopOrder: updateOrder,
            assignedDeliveryBoy: updateOrder.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment: updateOrder.assignment._id
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

}
export const getDeliveryAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;
        const assignment = await assignmentModel
            .find({
                brodcastedTo: deliveryBoyId,
                status: "brodcasted"
            })
            .populate({
                path: 'order',
                select: 'deliveryAddress shopOrders'
            })
            .populate({
                path: 'shop',
                select: 'shopName'
            })
        const formate = assignment.map(a => ({
            assignementId: a._id,
            orderId: a.order,
            shopName: a.shop.shopName,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItem || [],
            subTotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subTotal
        }))
        return res.status(200).json({ success: true, message: "Your assignements.", formate })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const acceptOrder = async (req, res) => {
    try {
        const { assignementId } = req.params;
        const assigenment = await assignmentModel.findById(assignementId);

        if (!assigenment) {
            return res.status(404).json({ success: false, message: "Order can't Found." })
        }
        if (assigenment.status !== "brodcasted") {
            return res.status(400).json({ success: false, message: "assigment is expire.." })
        }
        const alreadyAssigned = await assignmentModel.findOne({
            assignedTo: req.userId,
            status: { $nin: ["brodcasted", "compeleted",] }
        })

        if (alreadyAssigned) {
            return res.status(400).json({ success: false, message: " You Are Already Assigned To Other Orderd ." })
        }

        assigenment.assignedTo = req.userId
        assigenment.status = "assigned"
        assigenment.accepetedAt = new Date()
        await assigenment.save()

        const order = await orderModel.findById(assigenment.order)
        if (!order) {
            return res.status(400).json({ success: false, message: "Orderd not found.." })
        }
        const shopOrder = await order.shopOrders.id(assigenment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()
        return res.status(200).json({ success: true, message: "Order accept ." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getCurrentorder = async (req, res) => {
    try {
        const assigenment = await assignmentModel.findOne({
            assignedTo: req.userId,
            status: "assigned"
        })
            .populate("shop", "shopName")
            .populate("assignedTo", "fullName email mobile location")
            .populate({
                path: "order",
                populate: [{ path: "user", select: "fullName email mobile location" }]
            })

        if (!assigenment) {
            return res.status(400).json({ success: false, message: "assigenment not found.." })
        }
        if (!assigenment.order) {
            return res.status(400).json({ success: false, message: "order not found.." })
        }
        const shopOrder = assigenment.order.shopOrders.find(so => String(so._id) == String(assigenment.shopOrderId))
        if (!shopOrder) {
            return res.status(400).json({ success: false, message: "shopOrder not found.." })
        }
        let deliverBoyLocation = { lat: null, lon: null }
        let customerLocation = { lat: null, lon: null }
        if (assigenment.assignedTo.location.coordinates.length == 2) {
            deliverBoyLocation.lat = assigenment.assignedTo.location.coordinates[1]
            deliverBoyLocation.lon = assigenment.assignedTo.location.coordinates[0]
        }
        if (assigenment.order.deliveryAddress) {
            customerLocation.lat = assigenment.order.deliveryAddress.latitude
            customerLocation.lon = assigenment.order.deliveryAddress.longitude
        }

        return res.status(200).json({
            success: true, message: "Order accept .", data: {
                _id: assigenment.order._id,
                user: assigenment.order.user,
                shopOrder,
                deliveryAddress: assigenment.order.deliveryAddress,
                deliverBoyLocation,
                customerLocation
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

}

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItem.item",
                model: "Item"
            })
            .lean()

        if (!order) {
            return res.status(400).json({ success: false, message: "order not found.." })
        }
        return res.status(200).json({ success: true, message: "Order get .", order })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deliveryOtpSend = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        const order = await orderModel.findById(orderId).populate('user')
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ success: false, message: "enter valid order/shop.." })
        }
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000
        await order.save()
        await SendDeliveryEmail(order.user, otp)
        return res.status(200).json({ success: true, message: "Otp Send Successfully ." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deliveryOtpVerify = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body;
        const order = await orderModel.findById(orderId).populate('user')
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ success: false, message: "enter valid order/shop.." })
        }
        if (!shopOrder.deliveryOtp) {
            return res.status(400).json({ success: false, message: "somthing went wrong.." })
        }
        if (shopOrder.deliveryOtp !== otp) {
            return res.status(400).json({ success: false, message: "otp is incorrect.." })
        }
        if (shopOrder.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "otp is Expire.." })
        }
        shopOrder.deliveryOtp = null
        shopOrder.otpExpires = null
        shopOrder.status = "delivered",
        shopOrder.deliveryAt=Date.now()
        await order.save()

        await assignmentModel.deleteOne({
            shopOrderId:shopOrder._id,
            order:order._id,
            assignedTo:shopOrder.assignedDeliveryBoy
        })
        return res.status(200).json({ success: true, message: "Otp Verify Successfully ." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}