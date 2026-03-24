if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utilise/ExpressErorr.js");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");
const app = express();
const Listing = require("./models/listing");

const dbUrl = process.env.ATLASDB_URL;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Database connection
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Successfully Connected to MongoDB");
  })
  .catch((err) => console.log(err));

// Session & cookies
const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto:{
    secret:process.env.SECRECT,
  },
  touchAfter:24*3600,
});

store.on("error", ()=>{
  console.log("Error In Mongo Express Session",err);
});
const sessionOption = {
  store:store,
  secret: process.env.SECRECT,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};


app.use(session(sessionOption));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware for flash messages and user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.crnUser = req.user;
  next();
});

// Routes
app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

//For index route
app.get("/", async(req,res)=>{
 let allListing = await Listing.find({});
  res.render("./listing/index.ejs", { allListing });
})

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(8080, () => {
  console.log("Server Started on Port 8080!");
});
