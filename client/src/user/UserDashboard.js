// Packages
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

// Components
import Layout from "../core/Layout";

// Methods
import { isAuthenticated } from "../auth";
import { getPurchaseHistory } from "./apiUser";


// Functional Component for User Dashboard
const Dashboard = () => {

    // Using React Hooks to set the states associated
    // to the user dashboard.
    const [history, setHistory] = useState([]);

    // Using destructuring to extract user data from user,
    // which is destructured from isAuthenticated method.
    const {
        user: { _id, name, email, role }
    } = isAuthenticated();

    // Destructuring JWT token from isAuthenticated method.
    const token = isAuthenticated().token;

    // Method that will load when the component mounts on DOM.
    // It takes User ID & JWT token as arguments.
    const init = (userId, token) => {

        // Calling the getPurchaseHistory function and putting User ID
        // and JWT token as parameters to fetch the associated user's
        // purchase history.
        getPurchaseHistory(userId, token).then(data => {

            // If there is an error while fetching the user's purchase history.
            if (data.error) {
                console.log(data.error);
                // If the user's purchase history has been fetched successfully.
            } else {
                // Updating the state with data received from the server-side.
                setHistory(data);
            }

        });
    };

    // UseEffect runs whenever a React Component is mounted to the DOM
    // or whenever there is a change in state. It is a replacement of
    // Component lifecycle methods that were being used in earlier versions
    // of React. It takes a callback function as the first argument & an empty 
    // array as a second argument. The second argument may contain a state, 
    // upon a change in which, the useEffect can be run again.
    useEffect(() => {
        init(_id, token);
    }, []);


    // It will return the Resources that can be used by an authenticated
    // user inside his dashboard.
    const userLinks = () => {

        return (
            <div className="card">

                <h4 className="card-header">User Links</h4>

                <ul className="list-group">

                    <li className="list-group-item">
                        <Link className="nav-link" to="/cart">
                            My Cart
                        </Link>
                    </li>

                    <li className="list-group-item">
                        <Link className="nav-link" to={`/profile/${_id}`}>
                            Update Profile
                        </Link>
                    </li>

                </ul>

            </div>
        );
    };

    // It will return the user's information on dashboard.
    const userInfo = () => {
        return (
            <div className="card mb-5">

                <h3 className="card-header">User Information</h3>

                <ul className="list-group">

                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">
                        {role === 1 ? "Admin" : "Registered User"}
                    </li>

                </ul>

            </div>
        );
    };

    // It will return a user's purchase history.
    const purchaseHistory = history => {

        return (

            <div className="card mb-5">

                <h3 className="card-header">Purchase history</h3>

                <ul className="list-group">

                    <li className="list-group-item">

                        {/* Mapping through the history array received from server-side. */}
                        {history.map((h, i) => {
                            return (

                                <div>

                                    {/* Mapping through the product array that's present
                                     inside each history element. */}

                                    {h.products.map((p, i) => {

                                        return (

                                            <div key={i}>

                                                <h6>Product name: {p.name}</h6>

                                                <h6>
                                                    Product price: ${p.price}
                                                </h6>

                                                {/* Using moment package to show to purchase date
                                                in a user friendly way. */}
                                                <h6>
                                                    Purchased date:{" "}
                                                    {moment(
                                                        p.createdAt
                                                    ).fromNow()}
                                                </h6>

                                                <hr />

                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`Hello, ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">{userLinks()}</div>
                <div className="col-9">
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
