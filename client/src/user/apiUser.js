import { API } from "../config";

// Method to fetch a user's data.
// Takes User ID & JWT token as arguments.
export const getUserProfile = (userId, token) => {

    // Sending User's ID along with parameters.
    return fetch(`${API}/user/${userId}`, {

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
        // If the user details are being received successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while retrieving the user data.
        .catch(err => console.log(err));
};

// Method to update the USER details.
// Takes User ID, JWT Token & user object as arguments.
export const updateUserProfile = (userId, token, user) => {

    // Sending User's ID along with parameters.
    return fetch(`${API}/user/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        // Sending the stringified updated user data to the server-side.
        body: JSON.stringify(user)
    })
        // If the user details have been updated successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while updating the user details.
        .catch(err => console.log(err));
};

// Method to update the JWT token stored in 
// the local storage. Takes the updated user
// object and a callback as arguments.
export const updateLocalStorage = (user, next) => {

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== "undefined") {

        // Getting jwt token from the local storage.
        if (localStorage.getItem("jwt")) {

            // Parsing the user data
            let auth = JSON.parse(localStorage.getItem("jwt"));

            // Storing the updated user data.
            auth.user = user;

            // Setting the updated user data in local storage.
            localStorage.setItem("jwt", JSON.stringify(auth));

            // Callback function.
            next();
        }
    }
};

// Method to fetch a user's purchase history.
export const getPurchaseHistory = (userId, token) => {

    // Sending User's ID along with parameters.
    return fetch(`${API}/orders/by/user/${userId}`, {

        method: "GET",
        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        // If the user purchase history was retrieved successfully.
        .then(response => {
            return response.json();
        })
        // If there an error while retrieving the user purchase history.
        .catch(err => console.log(err));
};
