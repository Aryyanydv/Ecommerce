const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service : "gmail",
    auth : {
        user : "nanurao67@gmail.com",
        pass : "eatj dxry duyu bamw"
    }
});

const sendOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from : "nanurao67@gmail.com",
        to : email,
        subject : "Your OTP for verification",
        text : `Your OTP for verification is ${otp}. It will expire in 5 minutes.`
    });
};

module.exports = {sendOtpEmail};





























    