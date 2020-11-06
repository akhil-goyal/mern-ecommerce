import { API } from '../config';

// Method for USER SIGN-UP
// Takes 'user' as an arguement.
export const signup = user => {

    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        // Putting stringified user data in the body
        // before being sent to the server-side.
        body: JSON.stringify(user)
    })
        // If user has been registered successfully.
        .then(response => {
            return response.json();
        })
        // If there is an error while registering the user.
        .catch(err => {
            console.log(err);
        });
};

// Method for USER SIGN-IN
// Takes 'user' as an arguement.
export const signin = user => {

    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        // Putting stringified user data in the body
        // before being sent to the server-side.
        body: JSON.stringify(user)
    })
        // If user has been registered successfully.
        .then(response => {
            return response.json();
        })
        // If there is an error while registering the user.
        .catch(err => {
            console.log(err);
        });
};

export const authenticate = (data, next) => {

    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
};

// Method for USER SIGN-OUT
// Using next as a callback function, so that
// the application works normally after the 
// user has been logged out.
export const signout = next => {

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== 'undefined') {

        // Destroying the jwt token stored
        // in the local storage.
        localStorage.removeItem('jwt');

        // Callback function.
        next();

        return fetch(`${API}/signout`, {
            method: 'GET'
        })
            // If user has been signed out successfully.
            .then(response => {
                console.log('signout', response);
            })
            // If there is an error while signing out the user
            .catch(err => console.log(err));
    }
};

// Returning the authenticated user's data.
export const isAuthenticated = () => {

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window == 'undefined') {
        return false;
    }

    // Checking if the local storage has a JWT token.
    if (localStorage.getItem('jwt')) {
        // Returning the JWT token.
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};
