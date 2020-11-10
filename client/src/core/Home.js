// Packages
import React, { useState, useEffect } from 'react';

// Components
import Layout from './Layout';
import Card from './Card';
import Search from './Search';

// Packages
import { getProducts } from './apiCore';

// Functional Component to return Home
const Home = () => {

    // Using React Hooks to set the states associated
    // to the Home.
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    // Function to return the products as per their sales.
    const loadProductsBySell = () => {

        // Making request to the getProducts API
        getProducts('sold').then(data => {

            // If there's an error while retrieving the products.
            if (data.error) {

                // Updation of error state.
                setError(data.error);

            // If the products have been fetched successfully.
            } else {

                // Updation of setProductsBySell state.
                setProductsBySell(data);
            }
        });
    };

    // Function to return the products as per their arrival.
    const loadProductsByArrival = () => {

        // Making request to the getProducts API
        getProducts('createdAt').then(data => {
            
            // If there's an error while retrieving the products.
            if (data.error) {

                // Updation of error state.
                setError(data.error);

            // If the products have been fetched successfully.
            } else {

                // Updation of setProductsByArrival state.
                setProductsByArrival(data);
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
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return (
        <Layout
            title="FullStack React Node MongoDB Ecommerce App"
            description="Node React E-commerce App"
            className="container-fluid"
        >

            <Search />

            <h2 className="mb-4">New Arrivals</h2>

            <div className="row">
                {productsByArrival.map((product, i) => (
                    <div key={i} className="col-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>

            <h2 className="mb-4">Best Sellers</h2>

            <div className="row">
                {productsBySell.map((product, i) => (
                    <div key={i} className="col-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>
            
        </Layout>
    );
};

export default Home;
