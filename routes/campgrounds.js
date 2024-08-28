const { isLoggedIn, isAuthor, isValidCampground, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utilities/catchAsync");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");

const upload = multer({ storage });

router
    .route("/")
    // All campgrounds
    .get(catchAsync(campgrounds.allCampgrounds))
    // Post the new campground
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createNewCampground));
// .post(upload.array("image"), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("IT WORKED!");
// });

// Form to make a new campground
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

router
    .route("/:id")
    // View a specific campground
    .get(isValidCampground, catchAsync(campgrounds.viewCampground))
    // Edit a campground
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.editCampground))
    // Delete a campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Form to edit a campground
router.get("/:id/edit", isValidCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.editCampgroundForm));

module.exports = router;
