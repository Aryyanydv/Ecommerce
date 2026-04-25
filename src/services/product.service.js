const Product = require("../models/product");
const Review = require("../models/review");

const createProductService = async ({name,description,brand,attributes,variants,images}) => {
    try{
        const product = await Product.create({name,description,brand,attributes,variants,images});
        return product;
    }catch(error){
        console.log("Error in service layer while creating product",error);
        throw new Error("Error creating product");
    }
};

const getProductDetailsService = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const data = await Review.aggregate([
      {
        $match: {
          product: product._id
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      {
        $group: {
          _id: "$product",
          name: { $first: "$productDetails.name" },
          description: { $first: "$productDetails.description" },
          brand: { $first: "$productDetails.brand" },
          attributes: { $first: "$productDetails.attributes" },
          variants: { $first: "$productDetails.variants" },
          images: { $first: "$productDetails.images" },
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    return data;
  } catch (error) {
    console.log("Error in service", error);
    throw new Error("Error fetching product details");
  }
};


const getProducts = async (query) => {
  const { minPrice, maxPrice, brand, sort, page = 1, limit = 10 } = query;
  const pipeline = [];
  pipeline.push({ $unwind: "$variants" });
  const match = {};
  if (minPrice && maxPrice) {
    match["variants.price"] = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice)
    };
  }
  if (brand) {
    match.brand = brand;
  }
  if (Object.keys(match).length) {
    pipeline.push({ $match: match });
  }
  if (sort === "priceHighToLow") {
    pipeline.push({ $sort: { "variants.price": -1 } });
  } else if (sort === "priceLowToHigh") {
    pipeline.push({ $sort: { "variants.price": 1 } });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }
  pipeline.push(
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) }
  );
  return Product.aggregate(pipeline);
};

const getPriceBuckets = async () => {
  return Product.aggregate([
    { $unwind: "$variants" },
    {
      $bucket: {
        groupBy: "$variants.price",
        boundaries: [0, 1000, 2000, 5000, 10000],
        default: "Other",
        output: {
          count: { $sum: 1 }
        }
      }
    }
  ]);
};

module.exports = {createProductService, getProductDetailsService, getProducts, getPriceBuckets};