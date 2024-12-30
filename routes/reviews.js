const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilise/wrapAsync.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReviews, loggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews Post Route
router.post("/", loggedIn, validateReviews, wrapAsync( reviewController.newReview ));

//Delete Reviews Route
router.delete("/:reviewid", loggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview));

module.exports  = router;
