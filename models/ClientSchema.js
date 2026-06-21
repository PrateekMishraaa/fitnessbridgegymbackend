import mongoose, { Schema } from "mongoose";

const ClientSchema = new Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true, minLength: 10, maxLength: 10 },
    address: { type: String, required: true },
    
    // 🔥 Ab URL store karenge (Cloudinary se aayega)
    aadharFront: { type: String, required: true }, // Cloudinary URL
    aadharBack: { type: String, required: true }   // Cloudinary URL

}, { timestamps: true });

const Client = mongoose.model('Client', ClientSchema);
export default Client;