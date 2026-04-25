const wishlistService = require("../services/wishlist.service");

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId } = req.body;
    const wishlist = await wishlistService.addToWishlistService(
      userId,
      productId,
      variantId,
    );

    res.json({
      success: true,
      data: wishlist,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await wishlistService.getWishlistService(userId);
    res.json({
      success: true,
      data: wishlist,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId } = req.body;

    const wishlist = await wishlistService.removeFromWishlistService(
      userId,
      productId,
      variantId
    );

    res.json({
      success: true,
      data: wishlist,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const moveToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const result = await wishlistService.moveToCartService(userId, itemId);
    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  moveToCart
};