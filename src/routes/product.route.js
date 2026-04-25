const express = require('express');
const router = express.Router();
const productController = require("../controller/product.controller");
const uploadProductImages = require("../middlewares/uploadImage");
const userAuth = require("../middlewares/auth");


router.post("/product/create", uploadProductImages.array("images", 5), productController.createProduct);
router.get("/product/:id", userAuth, productController.getProductDetails);
router.get("/products", productController.getProductsController);
router.get("/products/buckets", productController.getPriceBucketsController);

module.exports = router;