const express = require('express');
const router = express.Router();
const walletController = require("../controller/wallet.controller");
const userAuth = require("../middlewares/auth");

router.post("/wallet/add-balance", userAuth, walletController.addBalanceController);
router.get("/wallet/balance", userAuth, walletController.getWalletBalanceController);
router.post("/wallet/apply-coupon", userAuth, walletController.applyWalletCouponController);

module.exports = router;