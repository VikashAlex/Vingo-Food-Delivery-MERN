import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: 'order',
    },
    shop: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop',
    },
    shopOrderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    brodcastedTo: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    assignedTo: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ["brodcasted", "assigned", "compeleted",],
        default: "brodcasted"
    },
    accepetedAt: Date
}, {
    timestamps: true
})
const assignmentModel = mongoose.model('Assignment', assignmentSchema);
export default assignmentModel