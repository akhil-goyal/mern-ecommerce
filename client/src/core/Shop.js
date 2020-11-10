// Packages
import React, { useState, useEffect } from "react";

// Components
import Layout from "./Layout";
import Card from "./Card";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";

// Methods
import { getCategories, getFilteredProducts } from "./apiCore";


// Functional Component for Shop
const Shop = () => {

    // Using React Hooks to set the states associated
    // to the Shop.
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] }
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    // Method that will load when the component mounts on DOM.
    // Here, it is loading the categories.
    const init = () => {

        // Making request to getCategories API.
        getCategories().then(data => {

            // If there's an error while fetching the categories.
            if (data.error) {

                // Updatng the error state.
                setError(data.error);

                // If the categories have been fetched successfully
            } else {

                // Updating the categories state.
                setCategories(data);
            }
        });
    };

    // Function to display products on the basis of filters
    // selected by the user.
    const loadFilteredResults = newFilters => {

        // Making request to getFilteredProducts API
        getFilteredProducts(skip, limit, newFilters).then(data => {

            // If there's an error while fetching the filtered products.
            if (data.error) {

                // Updating the error state.
                setError(data.error);

                // If the filtered products have been fetched successfully.
            } else {

                // Updating the states.
                setFilteredResults(data.data);
                setSize(data.size);
                setSkip(0);
            }
        });
    };

    // Function to load more products on the click of load more button.
    const loadMore = () => {

        let toSkip = skip + limit;

        // Making request to getFilteredProducts API.
        getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {

            // If there's an error while fetching the filtered products.
            if (data.error) {

                // Updating the error state.
                setError(data.error);

                // If the filtered products have been fetched successfully.
            } else {

                // Updating the states.
                setFilteredResults([...filteredResults, ...data.data]);
                setSize(data.size);
                setSkip(toSkip);
            }
        });
    };

    // It will return the load more button
    // if there are more products than set in the limit.
    // For example, if there are more than 6 products.
    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
    };

    // UseEffect runs whenever a React Component is mounted to the DOM
    // or whenever there is a change in state. It is a replacement of
    // Component lifecycle methods that were being used in earlier versions
    // of React. It takes a callback function as the first argument & an empty 
    // array as a second argument. The second argument may contain a state, 
    // upon a change in which, the useEffect can be run again.
    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters);
    }, []);


    // Function to handle filters.
    const handleFilters = (filters, filterBy) => {

        // Using spread operator to assign already exising
        // filters to newFilters.
        const newFilters = { ...myFilters };

        newFilters.filters[filterBy] = filters;

        // For filtering by price.
        if (filterBy === "price") {

            let priceValues = handlePrice(filters);

            newFilters.filters[filterBy] = priceValues;
        }

        // It will hit useEffect, such that, the component
        // will be re-mounted to update the products according
        // to the filtes applied.
        loadFilteredResults(myFilters.filters);

        // Updating the filters.
        setMyFilters(newFilters);

    };

    // Function to handle Product price.
    const handlePrice = value => {

        // Using static price range values.
        const data = prices;

        let array = [];

        // Pushing the selected radiobox key into the array.
        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };

    return (
        <Layout
            title="Shop Page"
            description="Search and find books of your choice"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox
                            categories={categories}
                            handleFilters={filters =>
                                handleFilters(filters, "category")
                            }
                        />
                    </ul>

                    <h4>Filter by price range</h4>
                    <div>
                        <RadioBox
                            prices={prices}
                            handleFilters={filters =>
                                handleFilters(filters, "price")
                            }
                        />
                    </div>
                </div>

                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, i) => (
                            <div key={i} className="col-4 mb-3">
                                <Card product={product} />
                            </div>
                        ))}
                    </div>
                    <hr />
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>
    );
};

export default Shop;
