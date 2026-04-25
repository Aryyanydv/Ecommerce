const Wishlist = require("../models/wishlist");
const { addToCartService } = require("./cart.service");

const addToWishlistService = async (userId, productId, variantId) => {
  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        items: []
      });
    }
    const alreadyExists = wishlist.items.find(
      item =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );
    if (alreadyExists) {
      throw new Error("Item already in wishlist");
    }

    wishlist.items.push({ productId, variantId});
    await wishlist.save();
    return wishlist;
  } catch (error) {
    console.log("Error in addToWishlistService:", error);
    throw error;
  }
};

const getWishlistService = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate("items.productId");
    return wishlist;
  } catch (error) {
    console.log("Error in getWishlistService:", error);
    throw error;
  }
};

const removeFromWishlistService = async (userId, productId, variantId) => {
  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    wishlist.items = wishlist.items.filter(
      item =>
        item.productId.toString() !== productId ||
        item.variantId.toString() !== variantId
    );
    await wishlist.save();
    return wishlist;
  } catch (error) {
    console.log("Error in removeFromWishlistService:", error);
    throw error;
  }
};

const moveToCartService = async (userId, itemId) => {
  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    const item = wishlist.items.id(itemId);

    if (!item) {
      throw new Error("Item not found in wishlist");
    }

    const productId = item.productId;
    const variantId = item.variantId;

    await addToCartService({ user: userId, productId, variantId, quantity: 1 });

    wishlist.items.pull(itemId);
    await wishlist.save();

    return { message: "Item moved to cart successfully" };

  } catch (error) {
    console.log("Error in moveToCartService:", error);
    throw error;
  }
};



module.exports = {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
  moveToCartService
};