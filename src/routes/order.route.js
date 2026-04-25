const express = require("express");
const router = express.Router();

const orderController = require("../controller/order.controller");
const userAuth = require("../middlewares/auth");

router.post("/order/place",userAuth, orderController.placeOrder);
router.patch("/payment-status", orderController.updatePaymentStatusController);
router.post("/create-razorpay-order", userAuth, orderController.createRazorpayOrderController);
router.post("/verify-payment", userAuth, orderController.verifyPaymentController);
router.get("/order/history", userAuth, orderController.getOrderHistory);
router.post("/order/:orderId/cancel", userAuth, orderController.cancelOrderController);
router.put("/order/update-status", orderController.updateOrderStatusController);
router.post("/order/:orderId/exchange", userAuth, orderController.exchangeOrderController);
router.post("/order/:orderId/return", userAuth, orderController.returnOrderController);

module.exports = router;