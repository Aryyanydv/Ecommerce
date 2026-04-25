const Order = require("../models/booking");
const Cart = require("../models/cart");
const Product = require("../models/product");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Wallet = require("../models/wallet");
const Coupon = require("../models/coupon");
const mongoose = require("mongoose"); 

const placeOrderService = async (
  userId,
  address,
  paymentMethod,
  { useWallet, couponCode },
  paymentInfo = {}
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }
  let items = [];
  let totalPrice = 0;

  for (let item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;
    const variant = product.variants.id(item.variantId);
    if (!variant) continue;
    const quantity = item.quantity || 1;
    const price = variant.price || 0;
    totalPrice += price * quantity;
    items.push({
      productId: product._id,
      variantId: variant._id,
      quantity,
      price
    });
  }
  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode
    });
    if (!coupon) throw new Error("Invalid coupon");
    if (coupon.expiryDate < new Date()) {
      throw new Error("Coupon expired");
    }
    appliedCoupon = coupon.code;
    if (coupon.discountType === "FLAT") {
      discount = coupon.discountValue;
    } else {
      discount = (totalPrice * coupon.discountValue) / 100;

      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
  }
  const priceAfterDiscount = totalPrice - discount;
  let walletUsed = 0;
  let finalAmount = priceAfterDiscount;
  let wallet = null;

  if (useWallet === true) {
    wallet = await Wallet.findOne({ userId });

    if (wallet && wallet.balance > 0) {
      if (wallet.balance >= priceAfterDiscount) {
        walletUsed = priceAfterDiscount;
        finalAmount = 0;
      } else {
        walletUsed = wallet.balance;
        finalAmount = priceAfterDiscount - wallet.balance;
      }
    }
  }
  if (paymentMethod === "ONLINE" && finalAmount > 0) {
    if (!paymentInfo.isVerified) {
      throw new Error("Payment not verified");
    }
  }
  if (useWallet && walletUsed > 0 && wallet) {
    if (wallet.balance < walletUsed) {
  throw new Error("Insufficient wallet balance");
}
    wallet.balance -= walletUsed;
    wallet.transactions.push({
      amount: walletUsed,
      type: "debit",
      reason: "Order payment"
    });
    await wallet.save();
  }
  const order = await Order.create({
    user: userId,
    items,
    totalAmount: totalPrice,
    discount,
    walletUsed,
    finalAmount,
    coupon: appliedCoupon,
    paymentMethod,
    paymentStatus: paymentMethod === "ONLINE" ? "SUCCESS" : "PENDING",
    paymentId: paymentInfo.paymentId || null,
    orderStatus: "PLACED",
    address
  });
  await Cart.findOneAndDelete({ user: userId });
  return order;
};

const updatePaymentStatusService = async (orderId, status) => {
  const validStatus = ["SUCCESS", "FAILED"];
  if (!validStatus.includes(status)) {
    throw new Error("Invalid payment status");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  order.paymentStatus = status;
  if (status === "SUCCESS") {
    order.orderStatus = "PLACED";
  } else if (status === "FAILED") {
    order.orderStatus = "CANCELLED";
  }
  await order.save();
  return order;
};


const createRazorpayOrderService = async (userId, { useWallet, couponCode }) => {
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
  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode
    });
    if (!coupon) throw new Error("Invalid coupon");
    if (coupon.expiryDate < new Date()) {
      throw new Error("Coupon expired");
    }
    appliedCoupon = coupon.code;
    if (coupon.discountType === "FLAT") {
      discount = coupon.discountValue;
    } else {
      discount = (totalPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
  }
  const priceAfterDiscount = totalPrice - discount;
  let walletUsed = 0;
  let finalAmount = priceAfterDiscount;
  if (useWallet === true) {
    const wallet = await Wallet.findOne({ userId });
    if (wallet && wallet.balance > 0) {
      if (wallet.balance >= priceAfterDiscount) {
        walletUsed = priceAfterDiscount;
        finalAmount = 0;
      } else {
        walletUsed = wallet.balance;
        finalAmount = priceAfterDiscount - wallet.balance;
      }
    }
  }
  if (finalAmount === 0) {
    return {
      paymentRequired: false,
      totalPrice,
      discount,
      walletUsed,
      finalAmount,
      coupon: appliedCoupon
    };
  }
  const razorpayOrder = await razorpay.orders.create({
    amount: finalAmount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });
  return {
    paymentRequired: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    totalPrice,
    discount,
    walletUsed,
    finalAmount,
    coupon: appliedCoupon
  };
};

// function to verify payment signature and take data from frontend and verify it
const verifyPaymentService = (data) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = data;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", "AepV2IprPHfual9wao5LYluq")
    .update(body)
    .digest("hex");
  console.log("EXPECTED:", expectedSignature);
  console.log("RECEIVED:", razorpay_signature);
  return expectedSignature === razorpay_signature;
};


const getOrderHistoryService = async (userId) => {
  try {
    const orders = await Order.find({ user: userId , orderStatus: { $in: ["PLACED", "SHIPPED", "DELIVERED"] } }).sort({ createdAt: -1 });
    return orders;
  } catch (error) {    console.log("Error in service layer while fetching order history", error);
    throw new Error("Error fetching order history");
  }
};


const currentOrderCancelService = async (userId, orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
    if (!order) {
      throw new Error("Order not found");
    }
    if (!["PLACED", "SHIPPED"].includes(order.orderStatus)) {
      throw error;
    }
    order.orderStatus = "CANCELLED";
    if (order.paymentStatus === "SUCCESS") {
      let wallet = await Wallet.findOne({ userId }).session(session);
      if (!wallet) {
        wallet = await Wallet.create([{
          userId,
          balance: 0,
          transactions: []
        }], { session }).then(res => res[0]);
      }
      wallet.balance += order.totalAmount;
      wallet.transactions.push({
        amount: order.totalAmount,
        type: "credit",
        reason: "Refund for cancelled order",
        createdAt: new Date()
      });
      await wallet.save({ session });
    }
    await order.save({ session });
    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in service layer while cancelling order", error);
    throw error;
  }
};


const updateOrderStatusService = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.orderStatus = status;
    await order.save();
    return order;
  } catch (error) {
    console.log("Error in service layer while updating order status", error);
    throw new Error("Error updating order status");
  }
};


const exchangeOrderService = async (userId, orderId, newVariantId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.orderStatus !== "DELIVERED") {
      throw new Error("Only delivered orders can be exchanged");
    }
    if (order.orderStatus === "EXCHANGED") {
      throw new Error("Order already exchanged");
    }
    const newOrderData = order.toObject();
    delete newOrderData._id;
    delete newOrderData.createdAt;
    delete newOrderData.updatedAt;
    newOrderData.orderStatus = "PLACED";
    newOrderData.paymentStatus = "SUCCESS";
    newOrderData.parentOrder = order._id;
    newOrderData.isExchange = true;
    newOrderData.items[0].variantId = newVariantId;
    const newOrder = await Order.create([newOrderData], { session }).then(res => res[0]);
    order.orderStatus = "EXCHANGED";
    await order.save({ session });
    await session.commitTransaction();
    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    console.log("Error in service layer while exchanging order", error);
    throw error;
  } finally {
    session.endSession();
  }
};


const returnOrderService = async (userId, orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.orderStatus !== "DELIVERED") {
      throw new Error("Only delivered orders can be returned");
    }
    if (order.orderStatus === "RETURNED") {
      throw new Error("Order already returned");
    }
    order.orderStatus = "RETURNED";
    if (order.paymentStatus === "SUCCESS") {
      let wallet = await Wallet.findOne({ userId }).session(session);
      if (!wallet) {
        wallet = await Wallet.create([{
          userId,
          balance: 0,
          transactions: []
        }], { session }).then(res => res[0]);
      }
      wallet.balance += order.totalAmount;
      wallet.transactions.push({
        amount: order.totalAmount,
        type: "credit",
        reason: "Refund for returned order",
        createdAt: new Date()
      });
      await wallet.save({ session });
    }
    await order.save({ session });
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    console.log("Error in service layer while returning order", error);
    throw error;
  } finally {
    session.endSession();
  }
};


module.exports = {
  placeOrderService,
  updatePaymentStatusService,
  createRazorpayOrderService,
  verifyPaymentService,
  getOrderHistoryService,
  currentOrderCancelService,
  updateOrderStatusService,
  exchangeOrderService,
  returnOrderService
};





