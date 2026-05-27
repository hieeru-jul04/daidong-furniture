import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    customerCode: {
        type: String,
        unique: true,
        sparse: true
    },
    email: String,
    phone: String,
    address: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, {timestamps: true});

export default mongoose.model('User', userSchema);