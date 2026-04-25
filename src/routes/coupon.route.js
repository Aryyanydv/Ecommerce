const express = require("express");
const router = express.Router();

const couponController = require("../controller/coupon.controller");
const userAuth = require("../middlewares/auth");

router.post("/coupon/create", couponController.createCoupon);
router.post("/coupon/apply", userAuth, couponController.applyCoupon);

module.exports = router;

