import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts, getBraintreeClientToken, processPayment } from './../core/apiCore';
import Card from './Card';
import { isAuthenticated } from './../auth/index';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import { emptyCart } from './cartHelpers';

const Checkout = ({ products }) => {

    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: '',
        loading: false
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token)
            .then(data => {
                if (data.error) {
                    setData({ ...data, error: data.error })
                } else {
                    setData({ clientToken: data.clientToken })
                }
            })
    }

    useEffect(() => {
        getToken(userId, token)
    }, [])

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    }

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
                <Link to="/signin" className="btn btn-primary">Sign in to checkout</Link>
            )
    }

    const buy = () => {

        setData({ loading: true });

        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }

                processPayment(userId, token, paymentData)
                    .then(response => {
                        setData({ ...data, success: response.success });
                        emptyCart(() => {
                            console.log('Payment success & empty cart!');
                            setData({ loading: false });
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        setData({ loading: false });
                    });
            })
            .catch(error => {
                setData({ ...data, error: error.message })
            })

    }

    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: '' })}>
            {
                data.clientToken !== null && products.length > 0 ? (
                    <div>
                        <DropIn
                            onInstance={instance => (data.instance = instance)}
                            options={{
                                authorization: data.clientToken,
                                paypal: {
                                    flow: 'vault'
                                }
                            }}
                        />
                        <button onClick={buy}>
                            Pay
                        </button>
                    </div>
                ) : null
            }
        </div>
    )

    const showLoading = (loading) => (
        loading && (<h2>Loading...</h2>)
    )

    const showSuccess = success => (
        <div style={{ display: success ? "" : 'none' }} className="alert alert-info">
            Payment verified!
        </div>
    )

    const showError = error => (
        <div style={{ display: error ? "" : 'none' }} className="alert alert-danger">
            {error}
        </div>
    )

    return (
        <div>
            <h2>Total : ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    )

}

export default Checkout;