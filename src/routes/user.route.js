const express = require('express');
const router = express.Router();
const userController = require("../controller/user.controller");
const uploadImg = require("../middlewares/uploadImage");
const otpRateLimiter = require("../middlewares/otpRateLimiter");
const user = require('../models/user');


router.post(
  "/user/signUp",
  uploadImg.single("profileImage"),
  userController.registerUser
);

router.post("/user/login", userController.loginUser);
router.post("/user/verify-otp", otpRateLimiter, userController.verifyOtp);


module.exports = router;