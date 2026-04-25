const express = require('express');
const router = express.Router();
const cartController = require("../controller/cart.controller");
const userAuth = require("../middlewares/auth");

router.post("/cart/add", userAuth, cartController.addToCart);
router.get("/cart", userAuth, cartController.getCartItems);
router.delete("/cart/:cartItemId", userAuth, cartController.removeCartItem);
router.put("/cart/update", userAuth, cartController.updateCartItem);
router.post("/cart/remove-coupon", userAuth, cartController.removeCoupon);

module.exports = router; 
