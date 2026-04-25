const Wallet = require("../models/wallet");
const Coupon = require("../models/coupon");
const Cart = require("../models/cart");
const Product = require("../models/product");

const addBalanceService = async (userId, amount, reason) => {
  try {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
    }   
    wallet.balance += amount;
    wallet.transactions.push({ amount, type: "credit", reason });
    await wallet.save();
    return wallet;
  } catch (error) {
    console.log("Error in service layer while adding balance", error);
    throw new Error("Error adding balance");
  } 
};


const getWalletService = async (userId) => {
  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return wallet;
  } catch (error) {
    console.log("Error in service layer while fetching wallet", error);
    throw new Error("Error fetching wallet");
  }
};


const applyWalletCouponService = async (userId, couponCode) => {
  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) throw new Error("Wallet not found");
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) throw new Error("Coupon not found");
    if (coupon.expiryDate < new Date()) throw new Error("Coupon expired");
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }
    let totalPrice = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const variant = product.variants.id(item.variantId);
      if (!variant) continue;
      totalPrice += (variant.price || 0) * (item.quantity || 1);
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
    } else if (coupon.discountType === "PERCENT") {
      discount = (totalPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
    const priceAfterDiscount = totalPrice - discount;
    let walletUsed = 0;
    let finalPrice = 0;
    if (wallet.balance >= priceAfterDiscount) {
      walletUsed = priceAfterDiscount;
      finalPrice = 0;
    } else {
      walletUsed = wallet.balance;
      finalPrice = priceAfterDiscount - wallet.balance;
    }
    wallet.balance -= walletUsed;
    wallet.transactions.push({
      amount: walletUsed,
      type: "debit",
      reason: "Used wallet balance for order"
    });
    await wallet.save();
    cart.coupon = coupon._id;
    await cart.save();

    return {
      totalPrice,
      discount,
      walletUsed,
      finalPrice,
      coupon: coupon.code
    };

  } catch (error) {
    console.log("Error in service layer while applying coupon", error.message);
    throw error;
  }
};

module.exports = {addBalanceService, getWalletService, applyWalletCouponService};  