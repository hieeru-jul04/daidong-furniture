import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    originalPrice: {
        type: Number,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    variants: {
        type: [
            {
                name: { type: String, required: true, trim: true },
                stock: { type: Number, default: 0, min: 0 }
            }
        ],
        default: []
    },
    status: {
        type: String,
        enum: ['Active', 'Draft', 'Out of Stock'],
        default: 'Active',
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    sale: {
        type: Boolean,
        default: false,
    },
    new: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
