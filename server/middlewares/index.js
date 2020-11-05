const expressJwt = require('express-jwt');

// Middleware to allow resource access to SIGNED IN users only.
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

// Middleware to allow resource access to AUTHENTICATED/AUTHORIZED users only.
exports.isAuthenticated = (req, res, next) => {

    let user = req.profile && req.auth && req.profile._id == req.auth._id

    if (!user) {
        return res.status(403).json({
            error: "Access denied!"
        });
    }

    next();
};

// Middleware to allow resource access to ADMINISTRATOR only.
exports.isAdmin = (req, res, next) => {

    // Checking the role.
    // Admin = 1
    // User = 0
    if (req.profile.role === 0) {

        return res.status(403).json({
            error: "Admin resource! Access Denied!!!!"
        });

    }

    next();
}