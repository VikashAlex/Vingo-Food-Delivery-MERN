import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    category: {
        type: String,
        enum: [
            "Snacks",
            "Main Course",
            "Desserts",
            "Pizza",
            "Burgers",
            "Sandwiches",
            "South Indain",
            "North Indain",
            "Chinese",
            "Fast Food",
            "Others"
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    foodType: {
        type: String,
        enum: ["veg", "non veg"],
        required: true
    },
    ratting: {
        min: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        average: { type: Number, default: 0 },
    }
}, { timestamps: true })

const itemModel = mongoose.model("Item", itemSchema);
export default itemModel