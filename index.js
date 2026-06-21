import express from "express";
const app = express();
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 2000
import mongoose from "mongoose"
import morgan from "morgan"
import Client from "./routes/ClientRoute.js"
import cors from "cors"
import { bootstrap } from 'global-agent';
import cloudinary from "./middleware/cloudinary.js";
bootstrap();
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json())
app.use('/api',Client)
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.get('/',(req,res)=>{
    console.log('hello')
    res.send("world")
})
mongoose.connect(process.env.MONGOURI)
.then(()=>console.log("connected to db"))
.catch((error)=>{{
    console.log('error', error)
}})



const testCloudinary = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log("✅ Cloudinary Connected:", result);
    } catch (error) {
        console.error("❌ Cloudinary Error:", error.message);
        console.error("Full Error:", error);
    }
};
testCloudinary();

app.listen(PORT,()=>console.log(`server is running at port ${PORT}`))