// Packages
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';

// Components
import Card from './Card';

// Methods
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';


// Functional Component to return Checkout page.
// Receiving products, setRun & run as props from
// the parent component.
const Checkout = ({ products, setRun = f => f, run = undefined }) => {

    // Using React Hooks to set the states associated
    // to the Checkout.
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });

    // Destructuring User ID object &  JWT token from isAuthenticated method.
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    // Funtion to get client token.
    // Takes User ID & JWT token as arguments.
    const getToken = (userId, token) => {

        // Using getBraintreeClientToken API
        getBraintreeClientToken(userId, token).then(data => {

            // If there's an error while fething the client token.
            if (data.error) {

                // Updating the error state.
                setData({ ...data, error: data.error });
            }

            // If the client token has been fetched successfully.
            else {

                // Updating the clientToken state.
                setData({ clientToken: data.clientToken });
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
        getToken(userId, token);
    }, []);

    // Handling the input change of address.
    // Takes event as argument. Event here denotes
    // the synthetic browser events.
    const handleAddress = event => {

        // Updating the address state.
        setData({ ...data, address: event.target.value });
    };

    // This will return the total price to be paid by customer
    // for all products in the cart.
    const getTotal = () => {

        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);

    };

    // Returning the drop in (checkout options) if the user
    // is authenticated.
    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
                <Link to="/signin">
                    <button className="btn btn-primary">Sign in to checkout</button>
                </Link>
            );
    };

    // Seting address state in a deliveryAddress variable.
    let deliveryAddress = data.address;

    // Here, the transaction will occur.
    const buy = () => {

        // Setting the locading state to true.
        setData({ loading: true });

        // Sending the nonce to server-side.
        // Nonce contains the payment related info,
        // such as card type, card number, amount total etc.
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {

                nonce = data.nonce;

                // Payment Data object to be sent to
                // the server-side.
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };

                processPayment(userId, token, paymentData)

                    // If the payment has been processed successfully.
                    .then(response => {

                        // Once the payment is successful, we shall be
                        // creating a new order & also, emptying the cart.

                        // Object to hold the order data.
                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        };

                        // Making request to createOrder API.
                        createOrder(userId, token, createOrderData)

                            // If order has been created successfully.
                            .then(response => {

                                // Emptying the cart.
                                emptyCart(() => {

                                    // Run useEffect in its parent component (Cart)
                                    setRun(!run);

                                    // Updating the loading & success states.
                                    setData({
                                        loading: false,
                                        success: true
                                    });
                                });
                            })

                            // If there's an error while creating the order.
                            .catch(error => {

                                // Updating the loading state.
                                setData({ loading: false });
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        setData({ loading: false });
                    });
            })

            // If there's an error while processing the payment.
            .catch(error => {

                // Updating the error state.
                setData({ ...data, error: error.message });
            });

    };

    // It will return the payment options box.
    // Will only return if there's a valid client token.
    const showDropIn = () => (

        <div onBlur={() => setData({ ...data, error: '' })}>

            {data.clientToken !== null && products.length > 0 ? (

                <div>

                    <div className="gorm-group mb-3">

                        <label className="text-muted">Delivery address:</label>

                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />

                    </div>

                    <DropIn
                        options={{
                            authorization: data.clientToken,
                            paypal: {
                                flow: 'vault'
                            }
                        }}
                        onInstance={instance => (data.instance = instance)}
                    />

                    <button onClick={buy} className="btn btn-success btn-block">
                        Pay
                    </button>

                </div>

            ) : null}

        </div>

    );

    // Returns error if error state is not null.
    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    // Return success if the success state is true.
    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Thanks! Your payment was successful!
        </div>
    );

    // Returns a loading message if the loading state is true.
    const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    );
};

export default Checkout;
