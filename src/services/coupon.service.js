const Coupon = require("../models/coupon");
const Cart = require("../models/cart");
const Product = require("../models/product");

const createCouponService = async ({
  code,
  discountType,
  discountValue,
  maxDiscount,
  minOrderValue,
  expiryDate,
  usageLimit,
  perUserLimit,
  isActive,
}) => {
  try {
    const coupon = await Coupon.create({
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
    return coupon;
  } catch (error) {
    console.log("Error in service layer while creating coupon", error);
    throw new Error("Error creating coupon");
  }
};


const applyCouponService = async (userId, couponCode) => {
  try {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    if (coupon.expiryDate < new Date()) {
      throw new Error("Coupon expired");
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }
    let totalPrice = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];
      const product = await Product.findById(cartItem.productId);
      if (!product) continue;
      const variant = product.variants.id(cartItem.variantId);
      if (!variant) continue;
      const quantity = cartItem.quantity || 1;
      const price = variant.price || 0;
      const itemTotal = price * quantity;
      totalPrice += itemTotal;
    }
    if (totalPrice < coupon.minOrderValue) {
      return {
        message: `Minimum order value should be ${coupon.minOrderValue}`,
        totalPrice
      };
    }
    let discount = 0;
    if (coupon.discountType === "FLAT") {
      discount = coupon.discountValue;
    }
    if (coupon.discountType === "PERCENT") {
      discount = (totalPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
    const finalPrice = totalPrice - discount;
    cart.coupon = coupon._id;
    await cart.save();
    return {
      totalPrice,
      discount,
      finalPrice,
      coupon: coupon.code
    };
  } catch (error) {
    console.log("Error in service layer while applying coupon", error.message);
    throw error;
  }
};


module.exports = { createCouponService, applyCouponService };
