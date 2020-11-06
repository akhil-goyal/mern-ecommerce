// Packages
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Components
import Layout from "../core/Layout";

// Methods
import { isAuthenticated } from "../auth";
import { getProducts, deleteProduct } from "./apiAdmin";


// Functional Component to manage the products.
const ManageProducts = () => {

    // Using React Hooks to set the states associated
    // to Manage Product.
    const [products, setProducts] = useState([]);

    // Destructuring user object, JWT token from isAuthenticated method.
    const { user, token } = isAuthenticated();


    // Function to load the products.
    const loadProducts = () => {

        // Calling the API getProducts so that they may be displayed when the
        // components is mounted.
        getProducts().then(data => {

            // If an error occurs while fetching the products.
            if (data.error) {
                console.log(data.error);

                // If the products have been fetched successfully.
            } else {
                setProducts(data);
            }
        });
    };


    // Function to delete a product.
    // Takes the productId as an argument.
    const destroy = productId => {

        // Calling API deleteProduct.
        // It takes User ID, Product ID, JWT token
        deleteProduct(productId, user._id, token).then(data => {

            // If an error occurs while deleting the product.
            if (data.error) {
                console.log(data.error);

                // If the product has been deleted successfully.
            } else {
                loadProducts();
            }
        });
    };


    // UseEffect runs whenever a React Component is mounted to the DOM
    // or whenever there is a change in state. It is a replacement of
    // Component lifecycle methods that were being used in earlier versions
    // of React. It takes a callback function as the first argument & an empty 
    // array as a second argument. The second argument may contain a state, 
    // upon a change in which, the useEffect can be run again.
    // Here, it will run the function loadProducts and display all the products
    // fetched from the API when the component loads on the DOM.
    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <Layout
            title="Manage Products"
            description="Perform CRUD on products"
            className="container-fluid"
        >
            <div className="row">

                <div className="col-12">

                    <h2 className="text-center">
                        Total {products.length} products
                    </h2>

                    <hr />

                    <ul className="list-group">

                        {products.map((p, i) => (

                            <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <strong>{p.name}</strong>

                                <Link to={`/admin/product/update/${p._id}`}>

                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>

                                </Link>

                                <span
                                    onClick={() => destroy(p._id)}
                                    className="badge badge-danger badge-pill"
                                >
                                    Delete
                                </span>

                            </li>
                        ))}

                    </ul>

                    <br />

                </div>
            </div>
        </Layout>
    );
};

export default ManageProducts;
