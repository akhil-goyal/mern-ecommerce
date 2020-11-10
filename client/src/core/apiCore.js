// Packages
import queryString from "query-string";

// Methods
import { API } from "../config";


// Method to get a list of all products.
export const getProducts = sortBy => {

    // Sorting the products based on fields selected by user
    // Desc represents descending order, i.e, newest products will appear on top.
    // Limit denotes how many products would server return at a time.
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
        // If the products have been fetched successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while fetching the products.
        .catch(err => console.log(err));
};

// Method to get a list of all categories.
export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: "GET"
    })
        // If the categories have been fetched successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while fetching the categories.
        .catch(err => console.log(err));
};

// Method to return products on the basis of user preferance.
export const getFilteredProducts = (skip, limit, filters = {}) => {

    // Object to be sent along with headers.
    const data = {
        limit,
        skip,
        filters
    };

    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        // Sending the strigified product preferance data to the server-side.
        body: JSON.stringify(data)
    })
        // If the products have been fetched successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while fetching the products.
        .catch(err => {
            console.log(err);
        });
};

// Method to return products on the basis of search query.
export const list = params => {

    // Using query-string package to send the search query as parameter
    // to the server.
    const query = queryString.stringify(params);

    return fetch(`${API}/products/search?${query}`, {
        method: "GET"
    })
        // If the searched products have been fetched successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while fetching the searched products.
        .catch(err => console.log(err));
};

// Method to return details of a particular product.
// Takes Product ID as argument.
export const read = productId => {

    return fetch(`${API}/product/${productId}`, {
        method: "GET"
    })
        // If the product details have been fetched successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while fetching the products details.
        .catch(err => console.log(err));
};

// Method to return products related to the selected product.
// Takes Product ID as argument.
export const listRelated = productId => {

    return fetch(`${API}/products/related/${productId}`, {
        method: "GET"
    })
        // If the related products have been fetched successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while fetching the related products.
        .catch(err => console.log(err));
};

// Method to return Braintree's client token.
// Takes User ID and JWT token as arguments.
export const getBraintreeClientToken = (userId, token) => {

    return fetch(`${API}/braintree/getToken/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        // If the client token has been received successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while receiving the client token.
        .catch(err => console.log(err));
};

// Method to process the payment & complete the transaction.
// Takes User ID, JWT token & Payment Data Object as arguments.
export const processPayment = (userId, token, paymentData) => {

    return fetch(`${API}/braintree/payment/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        // Sending the strigified payment data to the server-side.
        body: JSON.stringify(paymentData)
    })
        // If the payment has been processed successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while processing the payment.
        .catch(err => console.log(err));
};

// Method to place a new order.
// Takes User ID, JWT token, Order data object as arguments.
export const createOrder = (userId, token, createOrderData) => {

    return fetch(`${API}/order/create/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        // Sending the strigified order data to the server-side.
        body: JSON.stringify({ order: createOrderData })
    })
        // If the order has been created successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while creating the order.
        .catch(err => console.log(err));
};
