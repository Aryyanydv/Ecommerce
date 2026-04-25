const reviewService = require("../services/review.service");

const createReview = async (req,res) => {
    try{
        const {product,rating,comment} = req.body;
        const user = req.user._id;
        const review = await reviewService.createReviewService({user,product,rating,comment});
        res.status(201).json(review);
    }catch(error){
        console.log("Error in controller layer while creating review",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {createReview};

