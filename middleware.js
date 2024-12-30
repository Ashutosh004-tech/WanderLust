const Listing = require("./models/listing");
const ExpressError = require("./utilise/ExpressErorr.js");
const {ListingSchema} = require("./schema.js");
const {ReviewsSchema} = require("./schema.js");
const Reviews = require("./models/review.js");

module.exports.loggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.crnUser._id)){
        req.flash("error","You'er not the owner of this post");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateReviews = (req,res,next)=>{
    let {error} = ReviewsSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next)=>{
    const {id, reviewid} = req.params;
    let review = await Reviews.findById(reviewid);
    if(!review.author.equals(res.locals.crnUser._id)){
        req.flash("error","You'er not the Author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}