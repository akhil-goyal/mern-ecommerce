// Packages
import React, { useState } from "react";
import { Redirect } from "react-router-dom";

// Components
import Layout from "../core/Layout";

// Methods
import { signin, authenticate, isAuthenticated } from "./../auth";

// Functional Component for User Sign In
const Signin = () => {

    // Using React Hooks to set the states associated
    // to the user sign in.
    const [values, setValues] = useState({
        email: "akhil@gmail.com",
        password: "akhil123",
        error: "",
        loading: false,
        redirectToReferrer: false
    });

    // Destructuring the state values for the sake of simplicity.
    const { email, password, loading, error, redirectToReferrer } = values;

    // Destructuring user object from isAuthenticated method.
    const { user } = isAuthenticated();

    // This method listens for any change in input values.
    // Using a HIGHER ORDER FUNCTION, ie, a function returning an
    // another function. 'event' represents synthetic browser events.
    const handleChange = name => event => {

        // ...values means that the existing states are being used, 
        // the error is being set to false so that if there was any previous error,
        // it may hide when a user starts typing again. [name] can also be written as
        // event.target.name
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    // This method will work when the form is submitted to be updated.
    const clickSubmit = event => {

        // This will prevent the default behaviour of the browser.
        event.preventDefault();

        // Updating the state such that the loading has been set to true
        // A loader can be put here that runs until a response is received
        // from the server - side.
        setValues({ ...values, error: false, loading: true });

        // Calling the sigin method and setting user email & password as arguement.
        signin({ email, password }).then(data => {

            // If there's an error while signing in.
            if (data.error) {

                // The error state has been provided with error message and the loader
                // has been set to false.
                setValues({ ...values, error: data.error, loading: false });

                // If the user has been signed in successfully.
            } else {

                // Calling authenticate to set the user token in local storage.
                authenticate(data, () => {

                    // Updating the state.
                    setValues({
                        ...values,
                        redirectToReferrer: true
                    });
                });
            }
        });
    };

    // Function to return the Sign In form.
    const signUpForm = () => (

        <form>

            <div className="form-group">

                <label className="text-muted">Email</label>

                <input
                    onChange={handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />

            </div>

            <div className="form-group">

                <label className="text-muted">Password</label>

                <input
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />

            </div>

            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>

        </form>
    );

    // Returns if there's an error while signing in the user.
    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    //  It returns when the reuqest to sign in the user is still going.
    const showLoading = () =>
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        );

    // It redirects a user to the designated routes on the basis of
    // user being authenticated & his role.
    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />;
            } else {
                return <Redirect to="/user/dashboard" />;
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />;
        }
    };

    return (
        <Layout
            title="Signin"
            description="Signin to Node React E-commerce App"
            className="container col-md-8 offset-md-2"
        >
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
    );
};

export default Signin;
