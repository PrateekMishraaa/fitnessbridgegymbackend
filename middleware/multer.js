import multer from "multer";

// 🔥 Memory storage use karo (disk pe save nahi karna)
const storage = multer.memoryStorage();

// Sirf images allow karo
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sirf image files (jpg, png, etc.) hi upload karo!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per photo
    fileFilter: fileFilter
});

export default upload;