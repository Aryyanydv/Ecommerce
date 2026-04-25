const cartService = require("../services/cart.service");

const addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;
        const user = req.user._id;
        if (!productId || !variantId || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const cartItem = await cartService.addToCartService({ user, productId, variantId, quantity });
        res.status(201).json(cartItem);
    } catch (error) {
        console.log("Error in cart controller while adding to cart:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

const getCartItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const cartItems = await cartService.getCartItemsService(userId);
        res.status(200).json(cartItems);
    } catch (error) {
        console.log("Error in cart controller while fetching cart items:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        if (!cartItemId) {
            return res.status(400).json({ error: "Cart item ID is required" });
        }
        const cartItem = await cartService.removeCartItemService(cartItemId);
        res.status(200).json({ message: "Item removed from cart", cartItem });
    } catch (error) {
        console.log("Error in cart controller while removing cart item:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;
        const user = req.user._id;
        if (!productId || !variantId || quantity === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const cartItem = await cartService.updateCartItemService({ user, productId, variantId, quantity });
        res.status(200).json(cartItem);
    } catch (error) {
        console.log("Error in cart controller while updating cart item:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

const removeCoupon = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await cartService.removeCouponService(userId);
        res.status(200).json(result);
    } catch (error) {
        console.log("Error in cart controller while removing coupon:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

module.exports = { addToCart, getCartItems, removeCartItem, updateCartItem, removeCoupon };
