const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to WanderLust!");
        return res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
}


module.exports.loginForm = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "You have logged out successfully!");
      res.redirect("/listings");
    });
}