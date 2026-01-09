import mongoose from "mongoose";


const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    name: String,
    price: Number,
    qnty: Number
}, { timestamps: true })

const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop',
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    subTotal: Number,
    shopOrderItem: [shopOrderItemSchema],
    status: {
        type: String,
        enum: ["pending", "preparing", "out of delivery", "delivered"],
        default: "pending"
    },
    assignment: {
        type: mongoose.Types.ObjectId,
        ref: 'Assignment',
        default: null
    },
    assignedDeliveryBoy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    deliveryOtp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    deliveryAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number,
    },
    totalAmount: {
        type: Number
    },
    shopOrders: [shopOrderSchema],
},
    {
        timestamps: true
    }
)
const orderModel = mongoose.model('order', orderSchema)
export default orderModel