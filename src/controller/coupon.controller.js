const couponService = require("../services/coupon.service");

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minOrderValue,
      expiryDate,
      usageLimit,
      perUserLimit,
      isActive,
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return res.status(400).json({
        error:
          "Missing required fields: code, discountType, discountValue, expiryDate",
      });
    }

    const coupon = await couponService.createCouponService({
      code,
      discountType,
      discountValue,
      maxDiscount,
      minOrderValue,
      expiryDate,
      usageLimit,
      perUserLimit,
      isActive,
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.log("Error in controller layer while creating coupon", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user._id;
    if (!couponCode) {
      return res.status(400).json({
        error: "Missing required field: couponCode",
      });
    }
    const result = await couponService.applyCouponService(userId, couponCode);
    res.status(200).json({
      message: "Coupon applied successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error in controller layer while applying coupon", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

module.exports = { createCoupon, applyCoupon };

