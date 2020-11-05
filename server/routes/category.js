const express = require('express');
const router = express.Router();

const { userById } = require('../controllers/user');
const { requireSignin, isAuthenticated, isAdmin } = require('../controllers/auth');
const { createCategory, categoryById, fetchCategory, updateCategory, deleteCategory, listCategories } = require('../controllers/category');

// To get a list of all categories.
router.get('/categories', listCategories);

// To fetch a particular category using Category ID.
router.get('/category/:categoryId', fetchCategory);

// To Create a new category.
router.post('/category/create/:userId', requireSignin, isAuthenticated, isAdmin, createCategory);

// To update a category using Category ID.
router.put('/category/:categoryId/:userId', requireSignin, isAuthenticated, isAdmin, updateCategory);

// To delete a category using Category ID.
router.delete('/category/:categoryId/:userId', requireSignin, isAuthenticated, isAdmin, deleteCategory);

// Fetch Category ID from Parameters.
router.param('categoryId', categoryById);

// Fetch user data using User ID from Parameters.
router.param('userId', userById);

module.exports = router;
