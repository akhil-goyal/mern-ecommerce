const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    signout
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

// To register a new user.
router.post("/signup", userSignupValidator, signup);

// To log in for a registered user.
router.post("/signin", signin);

// To sign out for a logged in user.
router.get("/signout", signout);

module.exports = router;
