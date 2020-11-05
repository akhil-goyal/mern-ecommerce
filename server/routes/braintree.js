const express = require("express");
const router = express.Router();

const { userById } = require("../controllers/user");
const { requireSignin, isAuthenticated } = require("./../middlewares/index");
const { generateToken, processPayment } = require("../controllers/braintree");

// To generate token on the basis of client verification.
router.get("/braintree/getToken/:userId", requireSignin, isAuthenticated, generateToken);

// To process the payment when payment info received from the client-side.
router.post("/braintree/payment/:userId", requireSignin, isAuthenticated, processPayment);

// Fetch user data using User ID from Parameters.
router.param("userId", userById);

module.exports = router;
