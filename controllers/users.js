const User = require("../models/user");

module.exports.registerForm = (req, res) => {
    res.render("users/register", { title: "Register" });
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, (error) => {
            if (error) return next(error);
            req.flash("successs", "Registered successfully!");
            res.redirect("/campgrounds");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login", { title: "Log in" });
};

module.exports.logIn = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res) => {
    req.logOut(function (error) {
        if (error) {
            return next(error);
        }
    });
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
};
