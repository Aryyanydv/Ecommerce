const rateLimit = require('express-rate-limit');

const otpRateLimiter = rateLimit({
    windowMs : 5*60*1000, // 5 minutes
    max : 5, // limit each IP to 5 requests per windowMs
    message : "Too many OTP requests from this IP, please try again after 5 minutes"
});

module.exports = otpRateLimiter;


