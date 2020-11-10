// Packages
import React, { useState, useEffect } from "react";

// Components
import Card from "./Card";

// Methods
import { getCategories, list } from "./apiCore";


// Functional Component for Search
const Search = () => {

    // Using React Hooks to set the states associated
    // to the Search.
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });

    // Destructuring the states for the sake of simplicity.
    const { categories, category, search, results, searched } = data;


    // Function to return list of product categories.
    const loadCategories = () => {

        // Making request to the getCategories API
        getCategories().then(data => {

            // If there's an error while fetching thr categories.
            if (data.error) {
                console.log(data.error);

                // If the categories have been fetched successfully.
            } else {

                // Updating the category state.
                setData({ ...data, categories: data });
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
        loadCategories();
    }, []);


    // Fnction to return data on the basis of search query.
    const searchData = () => {

        // If there's a search query.
        if (search) {

            // Making request to list API.
            list({ search: search || undefined, category: category }).then(

                response => {

                    // If there's an error while fetching the products.
                    if (response.error) {
                        console.log(response.error);

                        // If the products have been fetched successfully.
                    } else {

                        // Updating the results & searched states.
                        setData({ ...data, results: response, searched: true });
                    }
                }
            );
        }
    };

    // Function that will run on the click of
    // search button. Here, e represents events.
    const searchSubmit = e => {

        // Preventing the default browser behaviour.
        e.preventDefault();

        // Calling the searchData function.
        searchData();
    };

    // This method listens for any change in input values.
    // Using a HIGHER ORDER FUNCTION, ie, a function returning an
    // another function. 'event' represents synthetic browser events.
    const handleChange = name => event => {

        // Updating the states.
        setData({ ...data, [name]: event.target.value, searched: false });
    };

    // Displaying the count of products found
    // associated to the search query.
    const searchMessage = (searched, results) => {

        if (searched && results.length > 0) {
            return `Found ${results.length} products`;
        }
        if (searched && results.length < 1) {
            return `No products found`;
        }
    };

    // Function to return the products returned
    // after the search query was submitted.
    const searchedProducts = (results = []) => {
        return (
            <div>

                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>

                <div className="row">

                    {results.map((product, i) => (
                        <div className="col-4 mb-3">
                            <Card key={i} product={product} />
                        </div>
                    ))}

                </div>
            </div>
        );
    };


    const searchForm = () => (

        <form onSubmit={searchSubmit}>

            <span className="input-group-text">

                <div className="input-group input-group-lg">

                    <div className="input-group-prepend">

                        <select
                            className="btn mr-2"
                            onChange={handleChange("category")}
                        >
                            <option value="All">All</option>

                            {categories.map((c, i) => (
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}

                        </select>

                    </div>

                    <input
                        type="search"
                        className="form-control"
                        onChange={handleChange("search")}
                        placeholder="Search by name"
                    />

                </div>

                <div
                    className="btn input-group-append"
                    style={{ border: "none" }}
                >
                    <button className="input-group-text">Search</button>

                </div>

            </span>

        </form>
    );

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    );
};

export default Search;
