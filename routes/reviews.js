const catchAsync = require("../utilities/catchAsync");
const express = require("express");
const reviews = require("../controllers/reviews");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

const router = express.Router({ mergeParams: true });

// Post a review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
