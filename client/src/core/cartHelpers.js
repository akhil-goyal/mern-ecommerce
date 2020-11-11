// Method to add a product to the cart.
// Takes an item (by default, an empty array), product count (by default, 0),
// callback function as arguments.
export const addToCart = (item = [], count = 0, next = f => f) => {

    // An empty cart array.
    let cart = [];

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== 'undefined') {

        // If there are already some items in the cart,
        // testing for it in localstorage.
        // If so, pushing that already existing data into
        // the cart array.
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // If there's no pre-existing cart data, then push
        // the newly received products into the cart array.
        cart.push({
            ...item,
            count: 1
        });


        // Here, we will be handling the issue of product duplication in cart.
        // Array.from is being used to re-map the filtered array.
        // New set will make sure that there are only unique ids in array.
        // Therefore, passing IDs of all the products through it.
        // Returning the unique products from the cart.
        cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
            return cart.find(p => p._id === id);
        });

        // Setting the unique cart in local storage.
        localStorage.setItem('cart', JSON.stringify(cart));

        // Callback function.
        next();
    }
};


// Method to calculate the total number of products 
// inside the cart.
export const cartTotal = () => {

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== 'undefined') {

        // Checking for cart in local storage.
        if (localStorage.getItem('cart')) {

            // Returning the total number of items available in cart.
            return JSON.parse(localStorage.getItem('cart')).length;
        }
    }

    // If no value is found, return 0.
    return 0;
};


// Method to return the cart data.
export const getCartData = () => {

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== 'undefined') {

        // Checking for cart in local storage.
        if (localStorage.getItem('cart')) {

            // Returning the data available in cart.
            return JSON.parse(localStorage.getItem('cart'));
        }
    }

    // If no value is found, return empty array.
    return [];
};


// Method to update the cart.
// Takes Product ID & count as arguments.
export const updateCartData = (productId, count) => {

    // An empty cart array.
    let cart = [];

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== 'undefined') {

        // Checking for cart in the local storage.
        if (localStorage.getItem('cart')) {

            // Setting parsed local storage data in cart array.
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // Mapping through the cart array. If there's an
        // exisiting product with same Product ID,
        // then its count is being updated.
        cart.map((product, i) => {
            if (product._id === productId) {
                cart[i].count = count;
            }
        });

        // Setting the updated cart data in local storage.
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};


// Method to remove an item from the cart.
// Takes Product ID as argument.
export const removeCartItem = productId => {

    // An empty cart array.
    let cart = [];

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== 'undefined') {

        // Checking for cart in the local storage.
        if (localStorage.getItem('cart')) {

            // Setting parsed local storage data in cart array.
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // Mapping through the cart array. Comparing the received
        // Product ID with ids of all the products in array.
        // When found, using .splice() to remove this product 
        // from the cart array.
        cart.map((product, i) => {
            if (product._id === productId) {
                cart.splice(i, 1);
            }
        });

        // Setting the updated cart data in local storage.
        localStorage.setItem('cart', JSON.stringify(cart));

    }

    // Returning the cart as is.
    return cart;
};


// Method to empty the cart.
// Takes a callback function as an argument. 
export const emptyCart = next => {

    // Checking, if the code will run in web-page
    // inside a web browser or not.
    if (typeof window !== 'undefined') {

        // Deleting the cart from localstorage.
        localStorage.removeItem('cart');

        // Callback function.
        next();
    }
};
