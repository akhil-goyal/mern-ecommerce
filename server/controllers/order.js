const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Fetch order data using Order ID from Parameters.
exports.orderById = (req, res, next, id) => {

    // Looking for order with Order ID received
    // from the parameters.
    Order.findById(id)
        // Populating with Product schema & including
        // name & price of the product associated.
        .populate('products.product', 'name price')
        .exec((err, order) => {

            // In case, an error occurs while
            // retrieving the product.
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            req.order = order;

            // Callback function.
            next();

        });
};

// To create a new order.
exports.createOrder = (req, res) => {

    req.body.order.user = req.profile;

    // Creating an instance of the 'Order' schema.
    const order = new Order(req.body.order);

    // Saving the newly received order.
    order.save((error, data) => {

        // In case, an error occurs while saving
        // the newly received order.
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }

        // In case, the newly received order is stored
        // successfully, its returned the client-side.
        res.json(data);

    });
};

// To fetch list of all the orders.
exports.listOrders = (req, res) => {

    // Finding all the orders
    Order.find()
        // Including _id, name & address of the user model.
        .populate('user', '_id name address')
        // Sorting the orders on basis of their creation.
        .sort('-created')
        .exec((err, orders) => {
            // In case, an error occurs while retrieving
            // the orders.
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            // In case, everything works fine, the list
            // of orders is returned to the client-side.
            res.json(orders);
        });

};

// To get the default values (ENUM) for order status.
exports.getStatusValues = (req, res) => {

    // Returning order status values stored as ENUM is Order schema.
    res.json(Order.schema.path('status').enumValues);

};

// To update the current order status.
exports.updateOrderStatus = (req, res) => {

    //  Updating the order status on the basis of Order ID
    //  received from the client-side. Setting the status 
    //  using $set & putting the status value as received 
    //  from the client-side.
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {

        // In case, an error occurs while updating
        // the order status.
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        // In case, the order status was updated 
        // successfully.
        res.json(order);

    });
};
