const Listing = require("../models/listing");

module.exports.indexRoute = async (req, res, next) => {
  let allListing = await Listing.find({});
  res.render("./listing/index.ejs", { allListing });
};

module.exports.newListingForm = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.showRoute = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not esits!");
    res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listing });
};

module.exports.createRoute = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing Create Successfully");
  res.redirect("/listings");
};

module.exports.updateForm = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not esits!");
    res.redirect("/listings");
  }

  let orginalImage = listing.image.url;
  orginalImage = orginalImage.replace("/upload", "/upload/w_250");
  res.render("./listing/edit.ejs", { listing, orginalImage});
};

module.exports.updateRoute = async (req, res, next) => {

  const { id } = req.params;
  const newListing = req.body.listing;
  let listing = await Listing.findByIdAndUpdate(id, newListing, {
    runValidators: true,
    new: true,
  });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
  req.flash("success", "Listing Update Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyRoute = async (req, res, next) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Delete Successfully");
  res.redirect("/listings");
};
