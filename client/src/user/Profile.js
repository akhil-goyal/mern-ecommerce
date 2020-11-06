// Packages
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

// Methods
import { isAuthenticated } from '../auth';
import { getUserProfile, updateUserProfile, updateLocalStorage } from './apiUser';

// Components
import Layout from '../core/Layout';


// Component to UPDATE the user profile.
// Destructuring the match from props.
// props.match can also be used.
const Profile = ({ match }) => {

    // Using React Hooks to set the states associated
    // to the user profile/update.
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        success: false
    });

    // Destructuring JWT token from isAuthenticated method.
    const { token } = isAuthenticated();

    // Destructuring the state values for the sake of simplicity.
    const { name, email, password, success } = values;

    // Method that will load when the component mounts on DOM.
    // It takes User ID as an arguement.
    const init = userId => {

        // Calling the getUserProfile function and putting User ID
        // and JWT token as parameters to fetch the associatd user details.
        getUserProfile(userId, token).then(data => {

            // If there is an error while fetching the user data.
            if (data.error) {
                setValues({ ...values, error: true });
                // If the user data has been fetched successfully.
                // Updating the states using setValues.
                // ...value implies that all the original values are being set to
                // the state. Name & email are being re-set.
            } else {
                setValues({ ...values, name: data.name, email: data.email });
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
        // Putting User ID as parameters that is being received from the props.
        init(match.params.userId);
    }, []);

    // This method listens for any change in input values.
    // Using a HIGHER ORDER FUNCTION, ie, a function returning an
    // another function. 'e' represents synthetic browser events.
    const handleChange = name => e => {

        // ...values means that the existing states are being used, 
        // the error is being set to false so that if there was any previous error,
        // it may hide when a user starts typing again. [name] can also be written as
        // event.target.name
        setValues({ ...values, error: false, [name]: e.target.value });
    };

    // This method will work when the form is submitted to be updated.
    const clickSubmit = e => {

        // This will prevent the default behaviour of the browser.
        e.preventDefault();

        // Calling updateUserProfile method and sending User ID, token & updated user
        // data object as parameters. 
        updateUserProfile(match.params.userId, token, { name, email, password }).then(data => {

            // If there's an error while updating the user data.
            if (data.error) {

                alert(data.error);

                // If the user data has been updated successfully.
            } else {

                // Calling updateLocalStorage method to update the user data in the local
                // storage as well. It takes in the updated user info & a callback function
                // as parameters.
                updateLocalStorage(data, () => {

                    // Updating the state
                    setValues({
                        ...values,
                        name: data.name,
                        email: data.email,
                        success: true
                    });
                });
            }
        });
    };

    // Method tp redirect the user after the
    // user details are updated successfully.
    const redirectUser = success => {
        if (success) {
            return <Redirect to="/cart" />;
        }
    };

    // Function to return the User Update Form
    // Takes user name, email & password as arguments.
    const profileUpdate = (name, email, password) => (

        <form>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" onChange={handleChange('name')} className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" onChange={handleChange('email')} className="form-control" value={email} />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" onChange={handleChange('password')} className="form-control" value={password} />
            </div>

            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>

        </form>
    );

    return (
        <Layout title="Profile" description="Update your profile" className="container-fluid">
            <h2 className="mb-4">Profile update</h2>
            {profileUpdate(name, email, password)}
            {redirectUser(success)}
        </Layout>
    );
};

export default Profile;
