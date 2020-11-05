const express = require('express');
const router = express.Router();

const { requireSignin, isAuthenticated } = require('../controllers/auth');

const { userById, getProfile, updateProfile, userPurchaseHistory } = require('../controllers/user');

// To test the working of user authentication using JWT.
router.get('/secret', requireSignin, (req, res) => { res.json({ user: 'Uncovering the secret!' }); });

// To get a user profile data using USER ID.
router.get('/user/:userId', requireSignin, isAuthenticated, getProfile);

// To update the user profile.
router.put('/user/:userId', requireSignin, isAuthenticated, updateProfile);

// To fetch purchase history of a user using USER ID.
router.get('/orders/by/user/:userId', requireSignin, isAuthenticated, userPurchaseHistory);

// Fetch user data using User ID from Parameters.
router.param('userId', userById);

module.exports = router;
