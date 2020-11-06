// Packages
import React, { useState, useEffect } from "react";
import moment from "moment";

// Components
import Layout from "../core/Layout";

// Methods
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";


// Functional component to manage the orders.
const Orders = () => {

    // Using React Hooks to set the states associated
    // to Manage Orders.
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);

    // Destructuring user object, JWT token from isAuthenticated method.
    const { user, token } = isAuthenticated();

    // Function to load the orders.
    const loadOrders = () => {

        // Calling the API listOrders.
        // Takes User ID & JWT token
        listOrders(user._id, token).then(data => {

            // If there's an error while fetching the orders.
            if (data.error) {
                console.log(data.error);

            // If the orders have been fetched successfully.
            } else {
                setOrders(data);
            }
        });
    };


    // Function to load the order status values.
    const loadStatusValues = () => {

        // Calling the API getStatusValues.
        // It takes User ID & JWT token.
        getStatusValues(user._id, token).then(data => {

            // If an error occurs while fetching the order status values.
            if (data.error) {
                console.log(data.error);

            // If the order status values are fetched successfully.
            } else {
                setStatusValues(data);
            }
        });
    };

    // UseEffect runs whenever a React Component is mounted to the DOM
    // or whenever there is a change in state. It is a replacement of
    // Component lifecycle methods that were being used in earlier versions
    // of React. It takes a callback function as the first argument & an empty 
    // array as a second argument. The second argument may contain a state, 
    // upon a change in which, the useEffect can be run again.
    // Here, it will run the function loadOrders & loadStatusValues and display
    //  all the orders, status values fetched from the API when the component 
    // loads on the DOM.
    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    // It will return the number of orders placed.
    const showOrdersLength = () => {

        // If there orders available.
        if (orders.length > 0) {
            return (
                <h1 className="text-danger display-2">
                    Total orders: {orders.length}
                </h1>
            );

        // If there are no orders.
        } else {
            return <h1 className="text-danger">No orders</h1>;
        }
    };

    // It will return the non-editable product details.
    // That's why the input has a 'readOnly' flag.
    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{key}</div>
            </div>
            <input
                type="text"
                value={value}
                className="form-control"
                readOnly
            />
        </div>
    );

    // This function will deal with the change in order status.
    const handleStatusChange = (e, orderId) => {

        // Calling API updateOrderStatus.
        // Takes User ID, JWT token, Order ID & newly selected order status.
        updateOrderStatus(user._id, token, orderId, e.target.value).then(
            data => {

                // If there is an error while updating the order status.
                if (data.error) {
                    console.log("Status update failed");

                // If the order status is updated successfully.
                } else {
                    loadOrders();
                }
            }
        );
    };

    // This will return the order status values.
    const showStatus = o => (
        <div className="form-group">

            <h3 className="mark mb-4">Status: {o.status}</h3>

            <select
                className="form-control"
                onChange={e => handleStatusChange(e, o._id)}
            >
                <option>Update Status</option>


                {/* Looping through the status values from the state. */}
                {statusValues.map((status, index) => (
                    <option key={index} value={status}>
                        {status}
                    </option>
                ))}
            </select>

        </div>
    );

    return (
        <Layout
            title="Orders"
            description={`Hello, ${user.name
                }, you can manage all the orders here.`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">

                    {showOrdersLength()}

                    {/* Mapping through all the orders. */}

                    {orders.map((o, oIndex) => {
                        return (
                            <div
                                className="mt-5"
                                key={oIndex}
                                style={{ borderBottom: "5px solid indigo" }}
                            >
                                <h2 className="mb-5">
                                    <span className="bg-primary">
                                        Order ID: {o._id}
                                    </span>
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(o)}
                                    </li>
                                    <li className="list-group-item">
                                        Transaction ID: {o.transaction_id}
                                    </li>
                                    <li className="list-group-item">
                                        Amount: ${o.amount}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered by: {o.user.name}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered on:{" "}
                                        {moment(o.createdAt).fromNow()}
                                    </li>
                                    <li className="list-group-item">
                                        Delivery address: {o.address}
                                    </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total products in the order:{" "}
                                    {o.products.length}
                                </h3>

                                {o.products.map((p, pIndex) => (
                                    <div
                                        className="mb-4"
                                        key={pIndex}
                                        style={{
                                            padding: "20px",
                                            border: "1px solid indigo"
                                        }}
                                    >
                                        {showInput("Product name", p.name)}
                                        {showInput("Product price", p.price)}
                                        {showInput("Product total", p.count)}
                                        {showInput("Product Id", p._id)}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
