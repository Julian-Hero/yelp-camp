const mongoose = require("mongoose");
const Review = require("./review");
const { cloudinary } = require("../cloudinary");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        geometry: {
            type: { type: String, enum: ["Point"], required: true },
            coordinates: { type: [Number], required: true },
        },
        price: Number,
        description: String,
        location: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    },
    { toJSON: { virtuals: true } }
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
        for (let image of doc.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
