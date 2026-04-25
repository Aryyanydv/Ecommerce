const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, 
    trim: true
  },

  discountType: {
    type: String,
    enum: ["PERCENT", "FLAT"],
    required: true
  },

  discountValue: {
    type: Number,
    required: true
  },

  maxDiscount: {
    type: Number, 
  },

  minOrderValue: {
    type: Number,
    default: 0
  },

  expiryDate: {
    type: Date,
    required: true
  },

  usageLimit: {
    type: Number, 
    default: null
  },

  usedCount: {
    type: Number,
    default: 0
  },

  perUserLimit: {
    type: Number,
    default: 1
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);