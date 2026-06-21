const Product = require("../models/product");
const Review = require("../models/review");
const mongoose = require("mongoose");

const createProductService = async ({name,description,brand,attributes,variants,images}) => {
    try{
        const product = await Product.create({name,description,brand,attributes,variants,images});
        return product;
    }catch(error){
        console.log("Error in service layer while creating product",error);
        throw new Error("Error creating product");
    }
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getProductDetailsService = async (productId) => {
  try {
    const data = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId)
        }
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews"
        }
      },
      {
        $addFields: {
          averageRating: {
            $avg: "$reviews.rating"
          },
          totalReviews: {
            $size: "$reviews"
          }
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          brand: 1,
          attributes: 1,
          variants: 1,
          images: 1,
          averageRating: 1,
          totalReviews: 1
        }
      }
    ]);

    if (!data.length) {
      throw new Error("Product not found");
    }

    return data[0];
  } catch (error) {
    console.log("Error in service", error);
    throw new Error("Error fetching product details");
  }
};


const getProducts = async (query) => {
  const { minPrice, maxPrice, brand, sort, page = 1, limit = 10, search } = query;
  const pipeline = [];
  pipeline.push({ $match: { isActive: true } });
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

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    match.$or = [
      { name: regex },
      { brand: regex },
      { description: regex },
      { "attributes.value": regex },
      { "variants.color": regex },
      { "variants.sku": regex }
    ];
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
    { $skip: (Number(page) - 1) * Number(limit) },
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

const getProductByBrandServices = async (brand) => {
  try{
    const product = await Product.find( {brand : brand} );
    if (!product) {
      console.log("product doesnot exist");
      return [];
    }
    return product;
  }catch(error){
    console.log("Error in the geting  product of a getProductByBrandServices in services", getProductByBrandServices)
  }
}


const searchProducts = async (query) => {
    const search = query.search?.trim();

    if (!search) {
      return [];
    }

    const regex = new RegExp(escapeRegex(search), "i");
    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { description: { $regex: regex } },
        { "attributes.value": { $regex: regex } },
        { "variants.color": { $regex: regex } },
        { "variants.sku": { $regex: regex } }
      ]
    });

    return products;
  };

module.exports = {createProductService, getProductDetailsService, getProducts, getPriceBuckets, getProductByBrandServices, searchProducts};