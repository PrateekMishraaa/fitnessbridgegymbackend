import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { bootstrap } from 'global-agent';
import Client from "./routes/ClientRoute.js";
import cloudinary from "./middleware/cloudinary.js";

// Load environment variables
dotenv.config();

// Bootstrap global-agent (only if needed for proxy)
bootstrap();

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'https://fitness-bridge-gym.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', Client);

// Test route
app.get('/', (req, res) => {
    console.log('hello');
    res.send("world");
});

// Connect to MongoDB and test Cloudinary (these run on cold start / each invocation)
// Note: In serverless, these will run on every function invocation, but it's acceptable.
mongoose.connect(process.env.MONGOURI)
    .then(() => {
        console.log("✅ Connected to DB");
        // Test Cloudinary after DB connection
        const testCloudinary = async () => {
            try {
                const result = await cloudinary.api.ping();
                console.log("✅ Cloudinary Connected:", result);
            } catch (error) {
                console.error("❌ Cloudinary Error:", error.message);
            }
        };
        testCloudinary();
    })
    .catch((error) => {
        console.error('❌ DB Connection Error:', error);
    });

// ✅ IMPORTANT: Export the Express app for Vercel (serverless)
export default app;

// ✅ LOCAL DEVELOPMENT: Run server only when not in production (e.g., Vercel sets NODE_ENV=production)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
        console.log(`🚀 Local server running at port ${PORT}`);
    });
}