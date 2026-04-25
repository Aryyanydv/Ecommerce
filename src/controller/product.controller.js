const productService = require("../services/product.service");

const createProduct = async (req,res) => {
    try{
        let {name,description,brand,attributes,variants} = req.body; 
        const images = req.files ? req.files.map(file => file.path) : [];
        attributes = attributes ? JSON.parse(attributes) : [];
        variants = variants ? JSON.parse(variants) : [];
        const product = await productService.createProductService({
            name,description,brand,attributes,variants,images
        });
        res.status(201).json(product);
    }catch(error){
        console.log("Error in controller:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getProductDetails = async (req,res) => {
    try{
        const productId = req.params.id;
        const productDetails = await productService.getProductDetailsService(productId);
        res.status(200).json(productDetails);
    }catch(error){
        console.log("Error in controller while fetching product details", error);
        res.status(500).json({error: "Internal Server Error"});
    }   };


const getProductsController = async (req, res) => {
    try{
        const products = await productService.getProducts(req.query);
        res.status(200).json(products);
    }catch(error){
        console.log("Error in controller while fetching products", error);
        res.status(500).json({error: "Internal Server Error"});
    }
    };


const getPriceBucketsController = async (req, res) => {
      try {
        const buckets = await productService.getPriceBuckets();
        res.status(200).json(buckets);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    };
      
    

module.exports = {createProduct, getProductDetails, getProductsController, getPriceBucketsController};