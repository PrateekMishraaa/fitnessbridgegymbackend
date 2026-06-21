import cloudinary from "../middleware/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer, folder = "fitness_gym") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export default uploadToCloudinary;