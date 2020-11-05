const express = require("express");

const router = express.Router();

const {
    createProduct,
    productById,
    getProduct,
    deleteProduct,
    updateProduct,
    listProducts,
    listRelatedProducts,
    listCategories,
    listFilteredProducts,
    productImage,
    searchProduct
} = require("../controllers/product");

const { userById } = require("../controllers/user");

const { requireSignin, isAuthenticated, isAdmin } = require("./../middlewares/index");

// To get list of all products.
router.get("/products", listProducts);

// To fetch a single product using Product ID.
router.get("/product/:productId", getProduct);

// To create a new product.
router.post("/product/create/:userId", requireSignin, isAuthenticated, isAdmin, createProduct);

// To update an existing product.
router.put("/product/:productId/:userId", requireSignin, isAuthenticated, isAdmin, updateProduct);

// To delete a product.
router.delete("/product/:productId/:userId", requireSignin, isAuthenticated, isAdmin, deleteProduct);

// To get the product PHOTO on basis of Product ID.
router.get("/product/photo/:productId", productImage);

// To get product/products on the basis of a SEARCH QUERY.
router.get("/products/search", searchProduct);

// To get filtered products on basis of parameters like skip, sort, limit, etc.
router.post("/products/by/search", listFilteredProducts);

// To get the list of all product categories.
router.get("/products/categories", listCategories);

// To get list of related products (On basis of category).
router.get("/products/related/:productId", listRelatedProducts);

// Fetch user data using User ID from Parameters.
router.param("userId", userById);

// Fetch product data using Product ID from Parameters.
router.param("productId", productById);

module.exports = router;
