const orderService = require("../services/order.service");

const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, paymentMethod, useWallet, couponCode, forcePaymentSuccess } = req.body || {};
    const order = await orderService.placeOrderService(
      userId,
      address,
      paymentMethod,
      { useWallet, couponCode },
      {
        isVerified: !!forcePaymentSuccess,
        forceSuccess: !!forcePaymentSuccess
      }
    );
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (error) {
    console.log("Order Error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const updatePaymentStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "orderId and status are required"
      });
    }
    const order = await orderService.updatePaymentStatusService(orderId, status);
    return res.status(200).json({
      success: true,
      message: "Payment status updated",
      data: order
    });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const createRazorpayOrderController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { useWallet, couponCode } = req.body || {};
    const order = await orderService.createRazorpayOrderService(
      userId,
      { useWallet, couponCode }
    );
    return res.status(200).json({
      success: true,
      message: "Razorpay order created",
      data: order
    });
  } catch (error) {
    console.log("Razorpay Error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const verifyPaymentController = async (req, res) => {
  try {
    const isValid = orderService.verifyPaymentService(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    const userId = req.user._id;

    const { address, useWallet = false, couponCode = null } = req.body || {};
    const order = await orderService.placeOrderService(
      userId,
      address,
      "ONLINE",
      { useWallet, couponCode },
      {
        isVerified: true, 
        paymentId: req.body.razorpay_payment_id
      }
    );
    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (error) {
    console.log("VERIFY ERROR:", error); 
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderService.getOrderHistoryService(userId);
    res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      data: orders
    });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const cancelOrderController = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { orderId } = req.params;
    const order = await orderService.currentOrderCancelService(userId, orderId);
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    console.log("Error in controller while cancelling order", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};


const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "orderId and status are required"
      });
    }
    const order = await orderService.updateOrderStatusService(orderId, status);
    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order
    });
  } catch (error) {
    console.log("Error in controller while updating order status", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};

const exchangeOrderController = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { orderId } = req.params;
    const { newVariantId } = req.body;
    if (!newVariantId) {
      return res.status(400).json({
        success: false,
        message: "newVariantId is required"
      });
    }
    const newOrder = await orderService.exchangeOrderService(
      userId,
      orderId,
      newVariantId
    );
    return res.status(200).json({
      success: true,
      message: "Exchange order created successfully",
      data: newOrder
    });
  } catch (error) {
    console.log("Error in controller while exchanging order", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};

const returnOrderController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await orderService.returnOrderService(userId, orderId);
    return res.status(200).json({
      success: true,
      message: "Order returned successfully",
      data: order
    });
  } catch (error) {
    console.log("Error in controller while returning order", error);  
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};


module.exports = {
  placeOrder,
  updatePaymentStatusController,
  createRazorpayOrderController,
  verifyPaymentController,
  getOrderHistory,
  cancelOrderController,
  updateOrderStatusController,
  exchangeOrderController,
  returnOrderController

};