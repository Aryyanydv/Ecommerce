const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp");  

const registerUserServices = async ({name,emailId,phoneNumber,gender,password,profileImage}) => {
    try{
        const hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            emailId,
            phoneNumber,
            gender,
            password : hashPassword,
            profileImage
        });
        return user;
    }catch(error){
        console.log("Error in service layer while registering user",error);
        throw error;
    }
}

const loginUserServices = async ({emailId,password}) => {
    try{
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("User not found with this emailId");
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            throw new Error("Invalid password");
        } 
        return user;
    }catch(error){
        console.log("Error in service layer while logging in user",error);
        throw error;
    }
}

const verifyOtpServices = async ({emailId,otp}) => {
    try{
        const otpRecord = await Otp.findOne({emailId,otp});
        if(!otpRecord){
            throw new Error("Invalid OTP");
        }
        if(!otpRecord || otpRecord.otp !== otp){
            throw new Error("Invalid OTP");
        }
        if(otpRecord.expiresAt < new Date()){
            throw new Error("OTP has expired");
        } 
        await Otp.deleteOne({emailId});
        const user = await User.findOne({emailId});
        const token = jwt.sign({userId: user._id}, "SECRET_KEY", {expiresIn : "1h"});
        return {user, token};
    }catch(error){
        console.log("Error in service layer while verifying OTP",error);
        throw error;
    }
}

module.exports = {
    registerUserServices,
    loginUserServices,
    verifyOtpServices
};