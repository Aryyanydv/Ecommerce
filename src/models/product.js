const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  brand: String,
  attributes: [
    {
      attribute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute"
      },
      value: String 
    }
  ],
  variants: [
    {
      size: Number,
      color: String,
      price: Number,
      compareAtPrice: Number,
      stock: Number,
      sku: {
        type: String,
        unique: true
      }
    }
  ],
  images: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);