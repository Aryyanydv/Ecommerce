const mongoose = require("mongoose");
const validator = require("validator");

const otpSchema = new mongoose.Schema({
    emailId : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        validate : {
            validator : validator.isEmail,
            message : "Please enter valid email!!"
        }
    },
    otp : {
        type : String,
    },
    expiresAt : {
        type : Date, 
    }
},{
    timestamps : true,
});

module.exports = mongoose.model("Otp",otpSchema);