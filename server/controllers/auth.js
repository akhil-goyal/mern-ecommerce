const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = ((req, res) => {
    const user = new User(req.body);
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

        res.json({
            user
        });
    })
});

exports.signin = ((req, res) => {
    // Finding user on the basis of email
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
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

        // Generating a signed token with user id and jwt secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        // Persisting the token as 't' in cookie with expiry date.
        res.cookie('t', token, { expire: new Date() + 9999 })

        // Return the response with user and token to the client-side.
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } })
    })
});

exports.signout = ((req, res) => {
    res.clearCookie('t')
    res.json({
        message: "User logged out!"
    })
})

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id

    if (!user) {
        return res.status(403).json({
            error: "Access denied!"
        });
    }

    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resource! Access Denied!!!!"
        });
    }
    next();
}