const catchAsync = require("../utilities/catchAsync");
const express = require("express");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

const router = express.Router();

router
    .route("/register")
    // Register form
    .get(users.registerForm)
    // Register
    .post(catchAsync(users.register));

router
    .route("/login")
    // Login form
    .get(users.loginForm)
    // Log in
    .post(
        storeReturnTo,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        users.logIn
    );

// Log out
router.get("/logout", users.logOut);

module.exports = router;
