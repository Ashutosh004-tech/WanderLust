const Reviews = require("../models/review");
const Listing = require("../models/listing.js");

module.exports.newReview = async (req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
    let newReviews = new Reviews(req.body.review);
    newReviews.author = req.user._id;
    listing.reviews.push(newReviews);
    await newReviews.save();
    await listing.save();
    req.flash("success","New Reviews added Successfully");

    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req,res,next)=>{
    let {id,reviewid}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Reviews.findByIdAndDelete(reviewid);
    req.flash("success","Reviews Deleted Successfully");

    res.redirect(`/listings/${id}`);

}