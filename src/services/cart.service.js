const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");



const addToCartService = async ({ user, productId, variantId, quantity }) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    const variant = product.variants.id(variantId);
    if (!variant) throw new Error("Variant not found");
    let cart = await Cart.findOne({ user });
    if (!cart) {
      cart = await Cart.create({
        user,
        items: [{ productId, variantId, quantity }]
      });
      return cart;
    }
    const existingItem = cart.items.find(
      item =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, variantId, quantity });
    }
    await cart.save();
    return cart;
  } catch (error) {
    console.log("Error:", error.message);
    throw error;
  }
};


const getCartItemsService = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return { items: [], totalPrice: 0, discount: 0, finalPrice: 0 };
    }
    let items = [];
    let totalPrice = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];
      const product = await Product.findById(cartItem.productId);
      if (!product) continue;

      const variant = product.variants.id(cartItem.variantId);
      if (!variant) continue;

      const quantity = cartItem.quantity || 1;
      const price = variant.price || 0;

      const itemTotal = price * quantity;
      totalPrice += itemTotal;

      items.push({
        cartItemId: cartItem._id,
        productId: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images && product.images.length > 0 ? product.images[0] : null,

        variant: {
          id: variant._id,
          size: variant.size,
          color: variant.color,
          price: price
        },

        quantity: quantity,
        itemTotal: itemTotal
      });
    }

    let discount = 0;
    let finalPrice = totalPrice;
    let couponCode = null;

    if (cart.coupon) {
      const coupon = await Coupon.findById(cart.coupon);
      if (coupon) {
        couponCode = coupon.code;
        if (coupon.discountType === "FLAT") {
          discount = coupon.discountValue;
        }
        if (coupon.discountType === "PERCENT") {
          discount = (totalPrice * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        }
        finalPrice = totalPrice - discount;
      }
    }
    return {
      items: items,
      totalPrice: totalPrice,
      discount: discount,
      finalPrice: finalPrice,
      coupon: couponCode
    };

  } catch (error) {
    console.log("Error fetching cart:", error.message);
    throw error;
  }
};


const removeCartItemService = async (cartItemId) => {
    try{
        const cartItem = await Cart.findByIdAndDelete(cartItemId);
        if(!cartItem){
            throw new Error("Cart item not found");
        }
        return cartItem;
    }catch(error){
        console.log("Error in service layer while removing cart item",error);
        throw new Error("Error removing cart item");
    }
}

const updateCartItemService =
  async ({
    user,
    productId,
    variantId,
    quantity
  }) => {
    try {
      const cart =
        await Cart.findOne({
          user
        });
      if (!cart) {
        throw new Error(
          "Cart not found"
        );
      }
      const item =
        cart.items.find(
          (item) =>
            item.productId.toString() ===
              productId &&
            item.variantId.toString() ===
              variantId
        );
      if (!item) {
        throw new Error(
          "Cart item not found"
        );
      }
      if (quantity < 0) {
        throw new Error(
          "Quantity cannot be negative"
        );
      }
      if (quantity === 0) {
        cart.items =
          cart.items.filter(
            (item) =>
              !(
                item.productId.toString() ===
                  productId &&
                item.variantId.toString() ===
                  variantId
              )
          );

      } else {
        item.quantity =
          quantity;
      }
      await cart.save();
      return cart;
    } catch (error) {

      console.log(
        "Error updating cart item:",
        error
      );

      throw error;
    }
  };



const removeCouponService = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    cart.coupon = null;
    await cart.save();
    return { message: "Coupon removed successfully" };
  } catch (error) {
    console.log("Error removing coupon", error);
    throw error;
  }
};

module.exports = {addToCartService, getCartItemsService, removeCartItemService, updateCartItemService, removeCouponService}; 