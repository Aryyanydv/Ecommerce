const userServices = require("../services/user.service");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp");
const { sendOtpEmail } = require("../utils/sendEmail");


const registerUser =async (req,res) => {
    try { 
        const name = req.body?.name;
        const emailId = req.body?.emailId;
        const phoneNumber = req.body?.phoneNumber;
        const gender = req.body?.gender;
        const password = req.body?.password;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const profileImage = req.file ? req.file.path : undefined;
        const user = await userServices.registerUserServices({
            name,
            emailId,
            phoneNumber,
            gender,
            password,
            profileImage
        });
        res.status(201).json({
            message : "User Registered Successfully",
            user
        });
    }catch (error) {
     console.error("ERROR:", error);
     res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
}

const loginUser = async (req,res) => {
    try{
        const {emailId,password} = req.body;
        const user = await userServices.loginUserServices({emailId,password});
        const otp = Math.floor(100000 + Math.random() * 900000);
        await Otp.deleteMany({emailId});
        await Otp.create({emailId,otp,expiresAt : new Date(Date.now() + 5 * 60 * 1000)}); 
        sendOtpEmail(emailId, otp); 
        console.log(`OTP for ${emailId} is ${otp}`);
        res.status(200).json({
            message : "Otp sent to your emailId, please verify",
            emailId
        });
    }catch(error){
        console.log("Error in controller layer while logging in user",error);
        res.status(500).json({
            message : error.message,
            stack : error.stack
        });
    }
}

const verifyOtp = async (req,res) => {
    try{
        const {emailId,otp} = req.body;
        const {user, token} = await userServices.verifyOtpServices({emailId,otp});
        res.cookie("token", token, {
            httpOnly : true,
            secure: false, 
            sameSite: "lax" });
        res.status(200).json({
            message : "OTP verified successfully",
            user,
            token
        });
    }catch(error){
        console.log("Error in controller layer while verifying OTP",error);
        res.status(500).json({
            message : error.message,
            stack : error.stack
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyOtp
};
