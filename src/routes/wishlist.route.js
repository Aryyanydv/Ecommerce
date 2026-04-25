const express = require('express');
const router = express.Router();
const wishlistController = require("../controller/wishlist.controller");
const userAuth = require("../middlewares/auth");

router.post("/wishlist/add", userAuth, wishlistController.addToWishlist);
router.get("/wishlist", userAuth, wishlistController.getWishlist);
router.post("/wishlist/remove", userAuth, wishlistController.removeFromWishlist);
router.post("/move-to-cart/:itemId", userAuth, wishlistController.moveToCart);

module.exports = router;
