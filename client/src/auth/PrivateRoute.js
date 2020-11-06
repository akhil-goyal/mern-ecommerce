import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

// It will ensure that the resources are protected for authenticated users
// only, i.e, no unregistered visitors can access these resources.
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>

            // Using ternary operator to determine whether a user is authenticated or
            // not, which is determined by checking isAuthenticated method through props.
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
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

export default PrivateRoute;
