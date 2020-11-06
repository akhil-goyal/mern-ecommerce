// Packages
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import Layout from '../core/Layout';

// Methods
import { signup } from '../auth';

// Functional Component for User Sign Up
const Signup = () => {

    // Using React Hooks to set the states associated
    // to the user sign in.
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    // Destructuring the state values for the sake of simplicity.
    const { name, email, password, success, error } = values;

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

        // Updating the states. ...values means that the existing states are being used
        setValues({ ...values, error: false });

        // Calling the sigup method and setting user name, email & password as arguement.
        signup({ name, email, password }).then(data => {

            // If there's an error while signing up.
            if (data.error) {

                // The error state has been provided with error message and the loader
                // has been set to false.
                setValues({ ...values, error: data.error, success: false });

                // If the user has been signed up successfully.
            } else {

                // Updating the states such as all the input values are being set to 
                // empty to enhance the User Experience. 
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: true
                });
            }
        });
    };

    // Function to return the Sign Up form.
    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email} />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    // Returns if there's an error while signing up the user.
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    // Returns if the user sign up has been completed successfully.
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );

    return (
        <Layout
            title="Signup"
            description="Signup to Node React E-commerce App"
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
            {showError()}
            {signUpForm()}
        </Layout>
    );
};

export default Signup;
