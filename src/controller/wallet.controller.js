const walletService = require("../services/wallet.service");

const addBalanceController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { amount, reason } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }
        const wallet = await walletService.addBalanceService(userId, amount, reason);
        res.status(200).json({ message: "Balance added successfully", wallet });
    } catch (error) {
        console.log("Error in wallet controller while adding balance:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

const getWalletBalanceController = async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await walletService.getWalletService(userId);
    res.status(200).json({
      balance: wallet.balance
    });
  } catch (error) {
    console.log("Error in wallet controller while fetching balance:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error"
    });
  }
};

const applyWalletCouponController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { couponCode } = req.body;
    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required"
      });
    }
    const result = await walletService.applyWalletCouponService(
      userId,
      couponCode
    );
    return res.status(200).json({
      success: true,
      message: "Coupon applied and wallet processed successfully",
      data: result
    });
  } catch (error) {
    console.log(
      "Error in wallet controller while applying coupon:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};


module.exports = {addBalanceController, getWalletBalanceController, applyWalletCouponController};