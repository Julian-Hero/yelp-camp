const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.allCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds, title: "All campgrounds" });
};

module.exports.newCampgroundForm = (req, res) => {
    res.render("campgrounds/new", { title: "New campground" });
};

module.exports.createNewCampground = async (req, res) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();

    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash("success", "Successfully made a new campground!");
    res.redirect(302, `/campgrounds/${newCampground._id}`);
};

module.exports.viewCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author");

    console.log(campground);

    if (!campground) {
        req.flash("error", "Could not find cammpground.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground, title: campground.title });
};

module.exports.editCampgroundForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
        req.flash("error", "Could not find cammpground.");
        return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground, title: `Edit ${campground.title}` });
};

module.exports.editCampground = async (req, res) => {
    const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, {
        ...req.body.campground,
    });

    if (req.files.length > 0) {
        const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
        updatedCampground.images.push(...images);
    }

    await updatedCampground.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash("success", "Successfully updated campground.");
    res.redirect(`/campgrounds/${updatedCampground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
};
