const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number, 
        required: true,
      },
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    default: 0,
  },

  finalAmount: {
    type: Number,
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED","INITIATED"],
    default: "PENDING",
  },

  orderStatus: {
    type: String,
    enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED","EXCHANGED", "RETURNED"],
    default: "PLACED",
  },

  address: {
    fullName: String,
    phone: String,
    pincode: String,
    city: String,
    state: String,
    addressLine: String,
  },
  parentOrder: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Order"
},
isExchange: {
  type: Boolean,
  default: false
}

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);