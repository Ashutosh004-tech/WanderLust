const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilise/wrapAsync.js");
const Listing = require("../models/listing.js");
const { loggedIn, isOwner, validateListing } = require("../middleware.js");

const listingsController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Rout
router
  .route("/")
  .get(wrapAsync(listingsController.indexRoute))
  .post(
    loggedIn,
    
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.createRoute)
  );

//New Route
router.get("/new", loggedIn, listingsController.newListingForm);

// Show Route
router
  .route("/:id")
  .get(wrapAsync(listingsController.showRoute))
  .put(
    loggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateRoute)
  )
  .delete(loggedIn, isOwner, wrapAsync(listingsController.destroyRoute));

//Upadate route
router.get(
  "/:id/edit",
  loggedIn,
  isOwner,
  wrapAsync(listingsController.updateForm)
);

module.exports = router;
