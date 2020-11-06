import { API } from '../config';


// Method to get a list of all categories : ADMIN ONLY!
export const getCategories = () => {

    return fetch(`${API}/categories`, {
        method: 'GET'
    })
        // If the categories have been fetched successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while fetching the categories.
        .catch(err => console.log(err));
};


// Method to fetch a category using Categor ID : ADMIN ONLY!
// Takes Category ID as argument.
export const getCategory = categoryId => {

    // Fetching a category using Category ID in parameters.
    return fetch(`${API}/category/${categoryId}`, {
        method: 'GET'
    })
        // If the category has been fetched successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while fetching the category.
        .catch(err => console.log(err));
};


// Method to create a new category : ADMIN ONLY!
// Takes User ID, JWT Token & category object as arguments.
export const createCategory = (userId, token, category) => {

    // Creating a new category using User ID in parameters.
    return fetch(`${API}/category/create/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },

        // Sending the strigified category data to the server-side.
        body: JSON.stringify(category)
    })
        // If the category has been created successfully.
        .then(response => {
            return response.json();
        })
        // If there's an error while creating the category.
        .catch(err => {
            console.log(err);
        });
};


// Method to update a category : ADMIN ONLY!
// Takes User ID, Category ID, JWT token & category object as arguments.
export const updateCategory = (categoryId, userId, token, category) => {

    // Updating an existing category using User ID & Category ID in parameters.
    return fetch(`${API}/category/${categoryId}/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },

        // Sending the stringified updated category to the server-side.
        body: JSON.stringify(category)
    })
        // If the category has been updated successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while updating the category.
        .catch(err => console.log(err));
};

















// Method to get a list of all orders : ADMIN ONLY!
// Takes User ID, JWT token as arguments.
export const listOrders = (userId, token) => {

    // Fetching all orders using User ID in parameters.
    return fetch(`${API}/order/list/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        // If the orders have been listed successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while listing the orders.
        .catch(err => console.log(err));
};


// Method to get a list of default status values.
// Takes User ID, JWT token as arguments.
export const getStatusValues = (userId, token) => {

    // Fetching all the status values using User ID in parameters.
    return fetch(`${API}/order/status-values/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        // If the status values have been fetched successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while fetching the status values.
        .catch(err => console.log(err));
};


// Method to update an order's status.
// Takes User ID, JWT token, Order ID & status as arguments.
export const updateOrderStatus = (userId, token, orderId, status) => {

    // Updating the order status using User ID & Order ID in parameters.
    return fetch(`${API}/order/${orderId}/status/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },

        // Sending the stringified updated status & Order ID to the server-side.
        body: JSON.stringify({ status, orderId })
    })
        // If the order status has been updated successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while updating the order status.
        .catch(err => console.log(err));
};


















// Method to get a list of all products : ADMIN ONLY!
export const getProducts = () => {

    return fetch(`${API}/products?limit=undefined`, {
        method: 'GET'
    })

        // If the products have been fetched successfully.
        .then(response => {
            return response.json();
        })

        // If there was an error while fetching the products.
        .catch(err => console.log(err));
};


// Method to fetch a specific product using Product ID : ADMIN ONLY!
// Takes Product ID as argument.
export const getProduct = productId => {

    // Fetching a product using Product ID.
    return fetch(`${API}/product/${productId}`, {
        method: 'GET'
    })

        // If the product has been fetched successfully.
        .then(response => {
            return response.json();
        })

        // If there was an error while fetching the product.
        .catch(err => console.log(err));
};


// Method to create a new product : ADMIN ONLY!
// Takes User ID, JWT token & product object as arguments.
export const createProduct = (userId, token, product) => {

    // Creating a new product using User ID.
    return fetch(`${API}/product/create/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product
    })
        // If the product has been created successfully.
        .then(response => {
            return response.json();
        })

        // If there's an error while creating the product.
        .catch(err => {
            console.log(err);
        });
};


// Method to update a product using Product ID : ADMIN ONLY!
// Takes User ID, Product ID, JWT token & updated product object as arguments.
export const updateProduct = (productId, userId, token, product) => {

    // Updating a product using User ID & Product ID.
    return fetch(`${API}/product/${productId}/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product
    })

        // If the product has been updated successfully.
        .then(response => {
            return response.json();
        })

        // If there was an error while updating the product.
        .catch(err => console.log(err));
};


// Method to delete a product using Product ID : ADMIN ONLY!
// Takes User ID, Product ID & JWT token as arguments.
export const deleteProduct = (productId, userId, token) => {

    // Deleting the product using User ID & Product ID.
    return fetch(`${API}/product/${productId}/${userId}`, {

        // Sending the JWT token to make sure that
        // the request has been made by an 
        // authorized user.
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

        // If the product has been deleted successfully.
        .then(response => {
            return response.json();
        })

        // If there was an error while deleting the product.
        .catch(err => console.log(err));
};



