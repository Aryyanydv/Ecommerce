const exptess = require('express');
const router = exptess.Router();
const reviewController = require("../controller/review.controller");
const userAuth = require("../middlewares/auth");

router.post("/review/create", userAuth, reviewController.createReview);

module.exports = router;