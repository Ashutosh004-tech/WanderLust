const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utilise/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

// Sign-up route
router
  .route("/signup")
  .get(userController.signUpForm)
  .post(wrapAsync(userController.signUp));

// Login route
router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Logout route
router.get("/logout", userController.logout);

module.exports = router;
