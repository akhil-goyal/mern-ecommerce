import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

// AdminRoute can be used to make the routes available exclusively for ADMIN only.
// These routes can not be used by any other user. It works on the basis of role 
// assigned to the user. If the role is 0, it will redirect the user to the Sign In
// page. If the role is 1, it will navigate the user to the path specified in the 
// Routes.js file for each respective AdminRoute.
const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>

            // Testing the user info from isAuthenticated through the props.
            // If the user is ADMIN, ie, role = 1
            isAuthenticated() && isAuthenticated().user.role === 1 ? (
                <Component {...props} />
            ) : (
                    //If the user is not ADMIN, ie, role = 0
                    <Redirect
                        to={{
                            pathname: "/signin",
                            state: { from: props.location }
                        }}
                    />
                )
        }
    />
);

export default AdminRoute;
