const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Fetch user data using User ID from Parameters.
exports.userById = (req, res, next, id) => {

    // Finding the user based on ID fetched from the parameters.
    User.findById(id).exec((err, user) => {

        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        // Setting the user data in req.profile so that it may be used
        // anywhere during the session.
        req.profile = user;

        // Using callback function to proceed further.
        next();
    });

};

// To get a user profile data using USER ID.
exports.getProfile = (req, res) => {

    // Setting salt & hashed_password as undefined so that they may not be 
    // returned along with other user data. (For safety purposes)
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    // Returning the user profile stored in req.profile in "userById" method.
    return res.json(req.profile);

};

// To update the user profile.
exports.updateProfile = (req, res) => {

    // Using destructuring to fetch name & password received from client-side
    // in req.body
    const { name, password } = req.body;

    // Searching for a particular user using the User ID in req.profile and
    // using it in .findOne() method to look for a user.
    User.findOne({ _id: req.profile._id }, (err, user) => {

        // If there is an error or there is no user available with the 
        // provided user id.
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        // If no name is received from the client-side.
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            // If the length of password is inappropriate.
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        // Saving the data wih updated user details.
        user.save((err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    error: 'User update failed'
                });
            }

            // Setting salt & hashed_password as undefined so that they may not be 
            // returned along with other user data. (For safety purposes)
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;

            // Returning the updated user info to the client-side.
            res.json(updatedUser);
        });
    });
};

// To store an order in purchase history of a user whenever a
// new order is placed.
exports.addOrderToUserHistory = (req, res, next) => {

    // Empty array initialization to store the order details.
    let history = [];

    // Looping through the orders received from client-side
    // and pushing their data into history array defined above.
    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    });

    // For the user in req.profile, the history array is stored.
    // new is set to true to return the updated user data.
    User.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history } }, { new: true }, (error, data) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update user purchase history'
            });
        }
        next();
    });
};

// To fetch purchase history of a user using USER ID.
exports.userPurchaseHistory = (req, res) => {

    // Finding orders for the user assocated to User ID
    // stored in req.profile
    Order.find({ user: req.profile._id })
        // Populating with User's ID & Name
        .populate('user', '_id name')
        // Sorting on the basis of order placement.
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });

};
