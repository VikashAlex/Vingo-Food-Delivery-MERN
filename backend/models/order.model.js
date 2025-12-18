import mongoose from "mongoose";


const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Types.ObjectId,
        ref: 'Item',
    },
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
    shopOrderItem: [shopOrderItemSchema]
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
        longtude: Number,
    },
    totalAmount: {
        type: Number
    },
    shopOrder: [shopOrderSchema]

},
    {
        timestamps: true
    }
)
const orderModel = mongoose.model('order', orderSchema)
export default orderModel