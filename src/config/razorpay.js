const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id : "rzp_test_SYtgn2sWZzGPAa",
    key_secret : "AepV2IprPHfual9wao5LYluq"
});

module.exports = razorpayInstance;
