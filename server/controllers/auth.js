const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

// To register a new user.
exports.signup = ((req, res) => {

    // Creating instance of user model & storing user data
    // received from client-side with req.body
    const user = new User(req.body);


    // Saving the user data received.
    user.save((err, user) => {

        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }

        // Salt and hashedPassword set to undefined
        // so that they may not be returned to the client-side.
        user.salt = undefined;
        user.hashedPassword = undefined;

        // Returning the newly signed up user data
        res.json({
            user
        });

    })
});


// To log in for a registered user.
exports.signin = ((req, res) => {

    // Destructuring email & password from req.body
    const { email, password } = req.body;

    // Finding user on the basis of email address
    User.findOne({ email }, (err, user) => {

        // If there is an error or there is no user
        // associated to the email provided.
        if (err || !user) {
            return res.status(400).json({
                error: "No user found. Please signup!"
            })
        }

        // Authenticating the user credentials
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match'
            })
        }

        // Generating a signed token using user id and jwt secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        // Persisting the token as 't' in cookie with expiry date.
        res.cookie('t', token, { expire: new Date() + 9999 })

        const { _id, name, email, role } = user;

        // Returning the response with user and token to the client-side.
        return res.json({ token, user: { _id, email, name, role } })
    })

});

// To sign out for a logged in user.
exports.signout = ((req, res) => {

    // Destroying the token by clearing the cookie.
    res.clearCookie('t')

    // Successful response for client-side.
    res.json({
        message: "User logged out!"
    })

});