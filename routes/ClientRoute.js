import express from 'express';
const router = express.Router();
import Client from "../models/ClientSchema.js";
import upload from "../middleware/multer.js";
import uploadToCloudinary from "../utills/cloudinaryUpload.js";

router.post('/register', upload.fields([
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 }
]), async (req, res) => {

    const { rollNo, firstName, lastName, email, mobile, address } = req.body;

    try {
       
        if (!req.files || !req.files['aadharFront'] || !req.files['aadharBack']) {
            return res.status(400).json({ 
                message: "Aadhar Front and Back both images are required" 
            });
        }

        const frontFile = req.files['aadharFront'][0];
        const backFile = req.files['aadharBack'][0];

        const [frontResult, backResult] = await Promise.all([
            uploadToCloudinary(frontFile.buffer, "aadhar_cards"),
            uploadToCloudinary(backFile.buffer, "aadhar_cards")
        ]);

   
        const aadharFrontUrl = frontResult.secure_url;  
        const aadharBackUrl = backResult.secure_url;

        const existingClient = await Client.findOne({ rollNo });
        if (existingClient) {
            return res.status(409).json({ message: "Client with this Roll No already exists" });
        }

        const newClient = await Client.create({
            rollNo,
            firstName,
            lastName,
            email,
            mobile,
            address,
            aadharFront: aadharFrontUrl,
            aadharBack: aadharBackUrl
        });

        console.log('✅ Client data successfully submitted', newClient);
        return res.status(201).json({
            message: "Welcome to Fitness Bridge Gym. You are verified.",
            clientData: newClient
        });

    } catch (error) {
        console.log('❌ Error:', error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
});
router.get('/client-data',async(req,res)=>{
    try{
        const clientData = await Client.find()
        console.log('this is all data',clientData)
        return res.status(200).json({message:"All data fetched from db successfully",clientData})
    }catch(error){
        console.log('error',error)
        return res.status(500).json({message:"Internal server error",error})
    }
});
router.delete('/delete-client/:id',async(req,res)=>{
    const {id} = req.params;
    try{
        const deleteClient = await Client.findByIdAndDelete(id)
        console.log('client has been deleted',deleteClient)
        return res.status(200).json({message:"Cleint has been deleted",deleteClient})
    }catch(error){
        console.log('error',error)
        return res.status(500).json({message:"Internal server error",error})    }
})

export default router;