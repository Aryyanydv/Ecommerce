const Review = require("../models/review");

const createReviewService = async ({user,product,rating,comment}) => {
    try{
        const review = await Review.create({user,product,rating,comment});
        return review;
    }catch(error){
        console.log("Error in service layer while creating review",error);
        throw new Error("Error creating review");
    }
};

module.exports = {createReviewService};