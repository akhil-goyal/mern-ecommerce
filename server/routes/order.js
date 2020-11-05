const express = require("express");
const router = express.Router();

const { decreaseQuantity } = require("../controllers/product");
const { userById, addOrderToUserHistory } = require("../controllers/user");
const { requireSignin, isAuthenticated, isAdmin } = require("../controllers/auth");
const { createOrder, listOrders, getStatusValues, orderById, updateOrderStatus } = require("../controllers/order");

// To create a new order.
router.post("/order/create/:userId", requireSignin, isAuthenticated, addOrderToUserHistory, decreaseQuantity, createOrder);

// To fetch list of all the orders.
router.get("/order/list/:userId", requireSignin, isAuthenticated, isAdmin, listOrders);

// To get the default values (ENUM) for order status.
router.get("/order/status-values/:userId", requireSignin, isAuthenticated, isAdmin, getStatusValues);

// To update the current order status.
router.put("/order/:orderId/status/:userId", requireSignin, isAuthenticated, isAdmin, updateOrderStatus);

// Fetch user data using User ID from Parameters.
router.param("userId", userById);

// Fetch order data using Order ID from Parameters.
router.param("orderId", orderById);

module.exports = router;
