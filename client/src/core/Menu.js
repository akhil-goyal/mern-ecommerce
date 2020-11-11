// Packages
import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";

// Methods
import { signout, isAuthenticated } from "../auth";
import { cartTotal } from "./cartHelpers";


// Checking for active/inactive links.
// Takes history & path as arguemnts.
const isActive = (history, path) => {

    // Matcing the current path.
    if (history.location.pathname === path) {
        return { color: "#fff", textDecoration: 'underline' };
    } else {
        return { color: "#ffffff" };
    }
};

const Menu = ({ history }) => (

    <div>

        <ul className="nav nav-tabs header">

            {isAuthenticated() && (

                <li className="nav-item">
                    <span
                        className="nav-link"
                        style={{ color: "#fff" }}
                    >
                        Welcome, {isAuthenticated().user.name}.
                    </span>
                </li>
            )}

            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, "/")}
                    to="/"
                >
                    Dashboard
                </Link>
            </li>

            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, "/shop")}
                    to="/shop"
                >
                    Shop
                </Link>
            </li>

            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/user/dashboard")}
                        to="/user/dashboard"
                    >
                        Account
                    </Link>
                </li>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/admin/dashboard")}
                        to="/admin/dashboard"
                    >
                        Account
                    </Link>
                </li>
            )}

            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, "/cart")}
                    to="/cart"
                >
                    <i class="fas fa-shopping-cart"></i>{" "}
                    <sup>
                        <small className="cart-badge">{cartTotal()}</small>
                    </sup>
                </Link>
            </li>

            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/signin")}
                            to="/signin"
                        >
                            Signin
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/signup")}
                            to="/signup"
                        >
                            Signup
                        </Link>
                    </li>
                </Fragment>
            )}

            {isAuthenticated() && (

                <li className="nav-item">

                    <span
                        className="nav-link"
                        style={{ cursor: "pointer", color: "#ffffff" }}
                        onClick={() =>
                            signout(() => {
                                history.push("/");
                            })
                        }
                    >
                        Signout
                    </span>
                </li>
            )}

        </ul>
    </div>
);

export default withRouter(Menu);
